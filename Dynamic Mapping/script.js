// ============ الإعدادات والمتغيرات العالمية ============
let scene, camera, renderer, controls;
const objects = []; // لتخزين الرفوف لغرض البحث
const textureLoader = new THREE.TextureLoader();

// 1. قائمة المنتجات (تأكد أن الـ shelfId يطابق الـ id في ملف الـ JSON)
const myProducts = [
    {
      "id": "8697498050048",
      "databaseId": "695c0080d9b642f807fd379b",
      "description": "قاطع مفرد 10 امبير",
      "category": "اخرى",
      "purchasePrice": 1.1,
      "salePrice": 1.2,
      "quantity": 18,
      "reorderPoint": 5,
      "createdAt": "2025-10-22T17:34:37.422Z",
      "updatedAt": "2026-1-8-4:25:22",
      "imagePath": "/images/dd54ed4f51d84f2aa90ef61fc49bed0c.jpg",
      "shelfId": "E-3"
    },
    {
      "id": "00111",
      "databaseId": "695c0080d9b642f807fd379c",
      "description": "قاطع فيرنا 10 امبير ",
      "category": "اخرى",
      "purchasePrice": 1.12,
      "salePrice": 1.5,
      "quantity": 19,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:46:38.161Z",
      "updatedAt": "2026-1-8-6:1:7",
      "imagePath": "/images/5270e82a957f440d8ccc7e4b1ab41d84.jpg",
      "shelfId": "A-2"
    },
    {
      "id": "00110",
      "databaseId": "695c0080d9b642f807fd379d",
      "description": "قاطع قلاب صيني مفرد",
      "category": "اخرى",
      "purchasePrice": 1.2,
      "salePrice": 1.4,
      "quantity": 20,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:45:46.408Z",
      "updatedAt": "2026-01-07T01:18:17.865Z",
      "imagePath": "/images/d12e7fdebeb64e499684dc1d584a7efc.jpg",
      "shelfId": "A-3"
    },
    {
      "id": "00109",
      "databaseId": "695c0080d9b642f807fd379e",
      "description": "كابل نحاس مجوز 1 ميلي (ليدات)",
      "category": "اخرى",
      "purchasePrice": 26.7,
      "salePrice": 28,
      "quantity": 5,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:45:00.954Z",
      "updatedAt": "2026-1-9-5:26:19",
      "imagePath": "/images/c9f7e637b2bb4e3aa368ddfe5b8efc9e.jpg",
      "shelfId": "A-4"
    },
    {
      "id": "00108",
      "databaseId": "695c0080d9b642f807fd379f",
      "description": "كابل نحاس مفرد 2.5 ميلي",
      "category": "اخرى",
      "purchasePrice": 32.4,
      "salePrice": 33.5,
      "quantity": 5,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:44:21.747Z",
      "updatedAt": "2026-01-06T20:12:29.390Z",
      "imagePath": "/images/ac0b0f18e5cd4c9ca41321b2d766eb23.jpg",
      "shelfId": "C-1"
    },
    {
      "id": "00107",
      "databaseId": "695c0080d9b642f807fd37a0",
      "description": "كابل نحاس مفرد 1.5 ميلي",
      "category": "اخرى",
      "purchasePrice": 22,
      "salePrice": 23.5,
      "quantity": 5,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:43:50.159Z",
      "updatedAt": "2025-10-16T20:32:39.462Z",
      "imagePath": null,
      "shelfId": "C-2"
    },
    {
      "id": "00106",
      "databaseId": "695c0080d9b642f807fd37a1",
      "description": "كابل نحاس مفرد 1 ميلي",
      "category": "اخرى",
      "purchasePrice": 15.8,
      "salePrice": 16.8,
      "quantity": 3,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:43:18.036Z",
      "updatedAt": "2026-01-08T00:48:47.122Z",
      "imagePath": null,
      "shelfId": "C-3"
    },
    {
      "id": "00105",
      "databaseId": "695c0080d9b642f807fd37a2",
      "description": "شمبر لينيا عاجي مائل",
      "category": "اخرى",
      "purchasePrice": 0.6,
      "salePrice": 0.85,
      "quantity": 50,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:41:11.948Z",
      "updatedAt": "2025-10-16T19:41:11.948Z",
      "imagePath": null,
      "shelfId": "C-4"
    },
    {
      "id": "00104",
      "databaseId": "695c0080d9b642f807fd37a3",
      "description": "بلاك لينيا عاجي تجاري",
      "category": "اخرى",
      "purchasePrice": 0.01,
      "salePrice": 0.1,
      "quantity": 200,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:39:05.702Z",
      "updatedAt": "2025-10-16T19:39:05.702Z",
      "imagePath": null,
      "shelfId": "B-1"
    },
    {
      "id": "00103",
      "databaseId": "695c0080d9b642f807fd37a4",
      "description": "بريز لينيا عاجي",
      "category": "اخرى",
      "purchasePrice": 0.3,
      "salePrice": 0.5,
      "quantity": 50,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:38:28.680Z",
      "updatedAt": "2026-01-07T02:36:38.311Z",
      "imagePath": "/images/558d85368ceb4863abb6fce8ba7344c5.jpg",
      "shelfId": "B-2"
    },
    {
      "id": "00101",
      "databaseId": "695c0080d9b642f807fd37a6",
      "description": "لمبات 10 واط ",
      "category": "اخرى",
      "purchasePrice": 0.6,
      "salePrice": 0.8,
      "quantity": 19,
      "reorderPoint": 5,
      "createdAt": "2025-10-16T19:36:34.326Z",
      "updatedAt": "2025-10-16T19:37:09.742Z",
      "imagePath": null,
      "shelfId": "B-3"
    },
   
];

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

let psid = "A-3";
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
