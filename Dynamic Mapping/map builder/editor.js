let scene, camera, renderer, controls;
let floor, grid;
let walls = [];
let selectedWall = null;

function init() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(8, 8, 8);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('warehouseCanvas'), antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    updateFloor(); // إنشاء الأرضية عند البدء
    setupRaycaster();
    animate();
}

function updateFloor() {
    if(floor) scene.remove(floor);
    if(grid) scene.remove(grid);

    const w = parseFloat(document.getElementById('w_width').value);
    const d = parseFloat(document.getElementById('w_depth').value);

    const geometry = new THREE.PlaneGeometry(w, d);
    const material = new THREE.MeshStandardMaterial({ color: 0x2e2e4e, side: THREE.DoubleSide });
    floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    grid = new THREE.GridHelper(Math.max(w, d), Math.max(w, d));
    scene.add(grid);
}

function uploadWallImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const texture = new THREE.TextureLoader().load(e.target.result);
        const geometry = new THREE.PlaneGeometry(2, 2); 
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
        const wall = new THREE.Mesh(geometry, material);
        
        wall.position.y = 1; // الرف فوق الأرضية
        wall.userData = { id: "رف " + (walls.length + 1) };
        
        scene.add(wall);
        walls.push(wall);
        selectWall(wall);
        event.target.value = ''; // تصفير المدخل لرفع صور أخرى
    };
    reader.readAsDataURL(file);
}
// دالة معالجة الصورة البانورامية
function uploadPanorama(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const texture = new THREE.TextureLoader().load(e.target.result);
        
        // إعداد الصورة لتكون بانورامية
        texture.mapping = THREE.EquirectangularReflectionMapping;
        
        // جعل الصورة هي خلفية المشهد (تجعل المستودع يبدو وكأنك بداخله)
        scene.background = texture;
        
        // أو إنشاء كرة ووضع الصورة بداخلها لتمكين وضع علامات على الرفوف
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1); // قلب الكرة لتظهر الصورة من الداخل
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    };
    reader.readAsDataURL(file);
}

function uploadPanorama(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const loader = new THREE.TextureLoader();
        loader.load(e.target.result, function(texture) {
            // 1. إعداد التنسيق البانورامي
            texture.mapping = THREE.EquirectangularReflectionMapping;
            
            // 2. جعل الصورة هي خلفية المشهد بالكامل
            scene.background = texture;
            
            // 3. (اختياري) إضافة إضاءة خفيفة من الصورة نفسها لجعل الرفوف تبدو واقعية
            scene.environment = texture;

            // 4. ضبط الكاميرا لتكون في المنتصف تماماً
            camera.position.set(0, 1.6, 0); // ارتفاع 1.6 متر (مستوى نظر الإنسان)
            controls.target.set(0.1, 1.6, 0); // تجعل الكاميرا تنظر للأمام
            
            console.log("✅ تم تفعيل الوضع البانورامي");
            alert("تم تحميل المنظر البانورامي. يمكنك الآن تدوير الكاميرا لرؤية المستودع بالكامل.");
        });
    };
    reader.readAsDataURL(file);
}

let panoramaTextures = { 1: null, 2: null };

function loadPano(event, id) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const loader = new THREE.TextureLoader();
        loader.load(e.target.result, function(texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            panoramaTextures[id] = texture; // حفظ الصورة في المصفوفة
            
            // تفعيل واجهة التبديل
            document.getElementById('pano-switcher').style.display = 'block';
            
            // عرض الصورة فور رفعها
            switchView(id);
        });
    };
    reader.readAsDataURL(file);
}

function switchView(id) {
    if (panoramaTextures[id]) {
        scene.background = panoramaTextures[id];
        
        // تأثير بصري بسيط عند الانتقال
        camera.position.set(0, 1.6, 0); 
        console.log(`تم الانتقال إلى المشهد رقم ${id}`);
    } else {
        alert("يرجى رفع الصورة لهذه النقطة أولاً.");
    }
}
let spheres = {}; // لتخزين كرات البانوراما
let currentPanoId = null;

function loadPano(event, id) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const texture = new THREE.TextureLoader().load(e.target.result);
        
        // إنشاء كرة بانورامية بدلاً من مجرد خلفية ثابتة
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1); // قلب الكرة لتظهر من الداخل
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const sphere = new THREE.Mesh(geometry, material);
        
        // تحديد موقع الكرة (مثلاً الكرة الثانية تبعد 50 متر عن الأولى)
        sphere.position.set(id === 1 ? 0 : 100, 0, 0); 
        
        scene.add(sphere);
        spheres[id] = sphere;
        
        document.getElementById('pano-switcher').style.display = 'block';
        switchView(id);
    };
    reader.readAsDataURL(file);
}

function switchView(id) {
    if (spheres[id]) {
        currentPanoId = id;
        const targetPos = spheres[id].position;
        
        // نقل الكاميرا إلى مركز الصورة الجديدة تماماً
        camera.position.set(targetPos.x, 1.6, targetPos.z);
        controls.target.set(targetPos.x + 0.1, 1.6, targetPos.z); // توجيه النظر للأمام
        
        // إخفاء الأرضية الشبكية لأنها تشوه المنظر الواقعي للبانوراما
        if(grid) grid.visible = false;
        if(floor) floor.visible = false;
        
        console.log(`انتقال واقعي للنقطة ${id}`);
    }
}

function addTransitionArrow(fromId, toId, x, z) {
    const arrowGeo = new THREE.CircleGeometry(1, 32);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const arrow = new THREE.Mesh(arrowGeo, arrowMat);
    
    arrow.position.set(x, 0.1, z);
    arrow.rotation.x = Math.PI / 2;
    arrow.userData = { type: 'checkpoint', targetId: toId };
    
    scene.add(arrow);
    
    // عند الضغط على السهم
    window.addEventListener('click', (event) => {
        // (استخدم نفس منطق الـ Raycaster المذكور سابقاً)
        if (intersects[0].object.userData.type === 'checkpoint') {
            switchView(intersects[0].object.userData.targetId);
        }
    });
}
function exportDesign() {
    // 1. تجميع الرفوف المرسومة (المكعبات)
    let allElements = [];
    
    // 2. تجميع الصور التي تم رفعها وتنسيقها
    scene.traverse(function (node) {
        if (node.isMesh) {
            // نتحقق إذا كان العنصر مكعب رف أو لوحة صورة
            allElements.push({
                id: node.uuid,
                name: node.userData.name || "عنصر مستودع",
                type: node.geometry.type === "BoxGeometry" ? "shelf" : "image_rack",
                position: { x: node.position.x, y: node.position.y, z: node.position.z },
                rotation: { y: node.rotation.y },
                scale: { x: node.scale.x, y: node.scale.y, z: node.scale.z },
                // إذا كانت صورة، سنحاول حفظ المسار أو البيانات
                hasTexture: !!node.material.map
            });
        }
    });

    if (allElements.length === 0) {
        alert("لا توجد عناصر (صور أو رفوف) لتصديرها حالياً!");
        return;
    }

    const designData = {
        projectName: "مخطط المستودع بالصور",
        elements: allElements,
        totalItems: allElements.length
    };

    const dataStr = JSON.stringify(designData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = "warehouse-full-layout.json";
    link.click();
}

// دالة لاختيار الرف عند الضغط عليه
function setupRaycaster() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(walls);

        if (intersects.length > 0) {
            selectWall(intersects[0].object);
        }
    });
}

function selectWall(wall) {
    if (selectedWall) selectedWall.material.color.set(0xffffff); // إرجاع اللون القديم
    selectedWall = wall;
    selectedWall.material.color.set(0x4ecca3); // تمييز المختار بلون أخضر بسيط
    document.getElementById('controls-ui').style.display = 'block';
    document.getElementById('selectedName').innerText = "المختار: " + wall.userData.id;
}

// وظائف التحكم بالأزرار
function moveSelected(x, z) {
    if (selectedWall) {
        selectedWall.position.x += x;
        selectedWall.position.z += z;
    }
}

function rotateSelected() {
    if (selectedWall) {
        selectedWall.rotation.y += Math.PI / 2;
    }
}

function deleteSelected() {
    if (selectedWall) {
        scene.remove(selectedWall);
        walls = walls.filter(w => w !== selectedWall);
        selectedWall = null;
        document.getElementById('controls-ui').style.display = 'none';
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.onload = init;
