// ============ الإعدادات والمتغيرات العالمية ============
let scene, camera, renderer, controls;
const objects = []; // لتخزين الرفوف لغرض البحث
const textureLoader = new THREE.TextureLoader();



// ============ دالة التشغيل الرئيسية ============
function init() {
    const canvas = document.getElementById('warehouse3D');
    const container = document.getElementById('mapContainer');
    if (!canvas || !container) return;

    // إعداد المشهد
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // إعداد الكاميرا (مناسبة للهاتف)
    camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(5, 2, 0);

    // إعداد المصير
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // الإضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // التحكم باللمس
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // إضافة أرضية (شبكة)
    const grid = new THREE.GridHelper(20, 20, 0x44445c, 0x222233);
    scene.add(grid);

    // تحميل البيانات والقائمة
    loadWarehouseLayout();
    renderProductList();
    
    animate();
}

// ============ تحميل المخطط والصور ============
async function loadWarehouseLayout() {
    try {
        const response = await fetch('warehouse-full-layout.json');
        const data = await response.json();
        
        data.elements.forEach((item, index) => {
            let material;

            // إذا كان العنصر يحتوي على صورة (كما في تصميمك)
            if (item.type === "image_rack") {
                // ملاحظة: استبدل 'shelf_image.jpg' بأسماء صورك الحقيقية
                // يمكنك ربط كل ID بصورة مختلفة هنا
                material = new THREE.MeshBasicMaterial({ 
                    color: 0x00ff88, 
                    transparent: true, 
                    opacity: 0.6,
                    side: THREE.DoubleSide 
                });
                
                // لتفعيل الصور الحقيقية، امسح التعليق عن السطر بالأسفل وضع اسم الصورة:
                material.map = textureLoader.load('A.jpg');
                // material.opacity = 1;
            } else {
                material = new THREE.MeshPhongMaterial({ color: 0x4ecca3 });
            }

            const geometry = new THREE.BoxGeometry(item.scale.x, item.scale.y, item.scale.z);
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.set(item.position.x, item.position.y, item.position.z);
            mesh.rotation.y = item.rotation.y;
            mesh.userData = { id: item.id }; // حفظ المعرف للبحث
            
            scene.add(mesh);
            objects.push(mesh);
        });

        if(document.getElementById('loading')) document.getElementById('loading').style.display = 'none';
        console.log("✅ تم بناء المستودع بنجاح");
    } catch (error) {
        console.error("❌ خطأ في تحميل ملف JSON:", error);
    }
}

// ============ نظام البحث والقائمة ============
function renderProductList() {
    const listContainer = document.getElementById('inventoryList');
    if (!listContainer) return;

    listContainer.innerHTML = "";
    myProducts.forEach(prod => {
        const card = document.createElement('div');
        card.className = "product-card";
        card.style.display = "flex";
        card.style.justifyContent = "space-between";
        card.style.alignItems = "center";
        card.style.padding = "15px";
        card.style.borderBottom = "1px solid #333";

        card.innerHTML = `
            <div>
                <div style="font-weight:bold">${prod.description}</div>
                <div style="font-size:12px; color:#aaa">الكمية
                : ${prod.quantity}</div>
            </div>
            <button class="btn-go" )" 
                style="background:#00ff88; border:none; padding:8px 15px; border-radius:5px; font-weight:bold">
                انتقال
            </button>
        `;
        listContainer.appendChild(card);
    });
}

let psid = localstorage.getItem("psid");
setTimeout(() => {
  navigateToProduct(psid);
}, 3000);

function navigateToProduct(psid) {
    // 1. البحث عن الرف المختار
    const target = objects.find(obj => obj.userData.id === psid);
    
    if (target) {
        const targetPos = target.position;
        
        // 2. تحريك الكاميرا لموقع يسمح برؤية الرف والمحيط (ابتعدنا قليلاً)
        let tarz;
        if (targetPos.z >= 0) {
            tarz = 0;
        } else {
            tarz = 0;
        }
        let tary;
        let tarx = -1;
        console.log(targetPos);
        camera.position.set(tarx, targetPos.y + 1, tarz);
        controls.target.copy(targetPos);
        
        // 3. حفظ اللون الأصلي
        const originalColor = target.material.color.getHex();
        
        // 4. تفعيل الوميض (تغيير اللون للأحمر الساطع)
        target.material.color.setHex(0x0000ff); 
        
        // إذا كنت تستخدم صوراً، سنقوم بتقليل الشفافية قليلاً ليظهر اللون الأحمر من خلفها
        const originalOpacity = target.material.opacity;
        target.material.transparent = true;
        target.material.opacity = 100;

        // 5. إعادة الإعدادات الأصلية بعد 2 ثانية
        setTimeout(() => {
            target.material.color.setHex(originalColor);
            target.material.opacity = originalOpacity;
        }, 20000);

        console.log("تم تحديد الرف بصرياً:", psid);
        
    } else {
        alert("لم يتم العثور على الرف، تأكد من مطابقة الـ ID في ملف الـ JSON." + psid);
    }
}

// ============ وظائف المحاكاة ============
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// إعادة ضبط العرض (لزر الهاتف)
function resetView() {
    camera.position.set(5, 2, 0);
    controls.target.set(0, 0, 0);
}

window.addEventListener('resize', () => {
    const container = document.getElementById('mapContainer');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});



window.onload = init;
