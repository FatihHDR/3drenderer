window.onload = function() {
    setTimeout(() => {
        const intro = document.getElementById('intro');
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.style.display = 'none';
            document.getElementById('renderer').style.display = 'block';
        }, 1000);
    }, 2000);
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('renderer'),
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

camera.position.z = 5;

const objects = [];
let selectedObject = null;
let isWireframe = false;
const deleteButton = document.getElementById('deleteObject');
const selectedObjectType = document.getElementById('selectedObjectType');

function deleteSelectedObject() {
    if (selectedObject) {
        scene.remove(selectedObject);
        const index = objects.indexOf(selectedObject);
        if (index > -1) {
            objects.splice(index, 1);
        }
        selectedObject = null;
        updateSelectionUI();
        updateControlsState();
    }
}

const autoRotation = {
    x: false,
    y: false,
    z: false
};

function createMaterial() {
    return new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        wireframe: isWireframe
    });
}

function updateSelectionUI() {
    if (selectedObject) {
        const geometryType = selectedObject.geometry.type
            .replace('Geometry', '')
            .replace('Buffer', '');
        selectedObjectType.textContent = geometryType;
        deleteButton.disabled = false;
    } else {
        selectedObjectType.textContent = 'None';
        deleteButton.disabled = true;
    }
}

function updateControlsState() {
    const controls = [
        'rotationX', 'rotationY', 'rotationZ', 'scale',
        'autoRotateX', 'autoRotateY', 'autoRotateZ',
        'rotateSpeedX', 'rotateSpeedY', 'rotateSpeedZ'
    ];
    
    controls.forEach(controlId => {
        document.getElementById(controlId).disabled = !selectedObject;
    });
}

deleteButton.addEventListener('click', deleteSelectedObject);

function addObjectToScene(object) {
    scene.add(object);
    objects.push(object);
    selectedObject = object;
    updateControlValues();
    updateSelectionUI();
    updateControlsState();
}

function addCube() {
    const geometry = new THREE.BoxGeometry();
    const material = createMaterial();
    const cube = new THREE.Mesh(geometry, material);
    addObjectToScene(cube);
}

function addSphere() {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = createMaterial();
    const sphere = new THREE.Mesh(geometry, material);
    addObjectToScene(sphere);
}

function addCylinder() {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = createMaterial();
    const cylinder = new THREE.Mesh(geometry, material);
    addObjectToScene(cylinder);
}

function addCone() {
    const geometry = new THREE.ConeGeometry(0.5, 1, 32);
    const material = createMaterial();
    const cone = new THREE.Mesh(geometry, material);
    addObjectToScene(cone);
}

function addTorus() {
    const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
    const material = createMaterial();
    const torus = new THREE.Mesh(geometry, material);
    addObjectToScene(torus);
}

function addPrism() {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 3);
    const material = createMaterial();
    const prism = new THREE.Mesh(geometry, material);
    addObjectToScene(prism);
}

function addOctahedron() {
    const geometry = new THREE.OctahedronGeometry(0.5);
    const material = createMaterial();
    const octahedron = new THREE.Mesh(geometry, material);
    addObjectToScene(octahedron);
}

function addTorusKnot() {
    const geometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16);
    const material = createMaterial();
    const torusKnot = new THREE.Mesh(geometry, material);
    addObjectToScene(torusKnot);
}

// 4D Renderer Functions
function addHyperCube() {
    const vertices = [
        [-1, -1, -1, -1], [1, -1, -1, -1], [1, 1, -1, -1], [-1, 1, -1, -1],
        [-1, -1, 1, -1], [1, -1, 1, -1], [1, 1, 1, -1], [-1, 1, 1, -1],
        [-1, -1, -1, 1], [1, -1, -1, 1], [1, 1, -1, 1], [-1, 1, -1, 1],
        [-1, -1, 1, 1], [1, -1, 1, 1], [1, 1, 1, 1], [-1, 1, 1, 1]
    ];

    const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        [8, 9], [9, 10], [10, 11], [11, 8],
        [12, 13], [13, 14], [14, 15], [15, 12],
        [8, 12], [9, 13], [10, 14], [11, 15],
        [0, 8], [1, 9], [2, 10], [3, 11],
        [4, 12], [5, 13], [6, 14], [7, 15]
    ];

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(edges.length * 6);

    function project4Dto3D(vertex) {
        const w = 2;
        const scale = 1 / (w - vertex[3]);
        return [
            vertex[0] * scale,
            vertex[1] * scale,
            vertex[2] * scale
        ];
    }

    for (let i = 0; i < edges.length; i++) {
        const start = project4Dto3D(vertices[edges[i][0]]);
        const end = project4Dto3D(vertices[edges[i][1]]);
        positions.set(start, i * 6);
        positions.set(end, i * 6 + 3);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const hypercube = new THREE.LineSegments(geometry, material);
    addObjectToScene(hypercube);
}

renderer.domElement.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        updateControlValues();
        updateSelectionUI();
        updateControlsState();
    }
});

function addDodecahedron() {
    const geometry = new THREE.DodecahedronGeometry(0.5);
    const material = createMaterial();
    const dodecahedron = new THREE.Mesh(geometry, material);
    addObjectToScene(dodecahedron);
}

function addStellatedDodecahedron() {
    const baseGeometry = new THREE.DodecahedronGeometry(0.5);
    const stellatedGeometry = new THREE.BufferGeometry();
    
    const positionAttribute = baseGeometry.getAttribute('position');
    const baseVertices = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
        baseVertices.push(vertex);
    }

    const indices = baseGeometry.getIndex().array;
    const faces = [];
    for (let i = 0; i < indices.length; i += 3) {
        faces.push([
            baseVertices[indices[i]],
            baseVertices[indices[i + 1]],
            baseVertices[indices[i + 2]]
        ]);
    }

    const faceCenters = faces.map(face => {
        const center = new THREE.Vector3();
        face.forEach(vertex => center.add(vertex));
        return center.divideScalar(3);
    });

    const faceNormals = faces.map(face => {
        const v1 = face[1].clone().sub(face[0]);
        const v2 = face[2].clone().sub(face[0]);
        return new THREE.Vector3().crossVectors(v1, v2).normalize();
    });

    const stellationHeight = 0.6; // Adjusted for better proportions
    const pyramidTips = faceCenters.map((center, i) => 
        center.clone().add(faceNormals[i].multiplyScalar(stellationHeight))
    );

    // Prepare vertices and indices for the stellated geometry
    const vertices = [];
    const newIndices = [];

    // Add all vertices from base geometry
    baseVertices.forEach(vertex => {
        vertices.push(vertex.x, vertex.y, vertex.z);
    });

    // Add pyramid tips
    pyramidTips.forEach(tip => {
        vertices.push(tip.x, tip.y, tip.z);
    });

    // Add original faces
    for (let i = 0; i < indices.length; i += 3) {
        newIndices.push(indices[i], indices[i + 1], indices[i + 2]);
    }

    // Create pyramid faces
    faces.forEach((face, faceIndex) => {
        const tipIndex = baseVertices.length + faceIndex;
        
        // Get indices of the current face vertices
        const i0 = baseVertices.indexOf(face[0]);
        const i1 = baseVertices.indexOf(face[1]);
        const i2 = baseVertices.indexOf(face[2]);

        // Create three triangles for each pyramid face
        newIndices.push(
            i0, i1, tipIndex,
            i1, i2, tipIndex,
            i2, i0, tipIndex
        );
    });

    // Set geometry attributes
    stellatedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    stellatedGeometry.setIndex(newIndices);
    stellatedGeometry.computeVertexNormals();

    const material = createMaterial();
    const stellatedDodecahedron = new THREE.Mesh(stellatedGeometry, material);
    addObjectToScene(stellatedDodecahedron);
}

function addMengerSponge(iterations = 3) {
    const sponge = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 }); // Set the color to green

    function createBox(x, y, z, size) {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const box = new THREE.Mesh(geometry, material);
        box.position.set(x, y, z);
        return box;
    }

    function divideBox(box, iterations) {
        if (iterations === 0) {
            sponge.add(box);
        } else {
            const newSize = box.geometry.parameters.width / 3;
            const positions = [-1, 0, 1];
            positions.forEach(i => {
                positions.forEach(j => {
                    positions.forEach(k => {
                        const sum = Math.abs(i) + Math.abs(j) + Math.abs(k);
                        if (sum > 1) {
                            const newBox = createBox(
                                box.position.x + i * newSize,
                                box.position.y + j * newSize,
                                box.position.z + k * newSize,
                                newSize
                            );
                            divideBox(newBox, iterations - 1);
                        }
                    });
                });
            });
        }
    }

    const initialBox = createBox(0, 0, 0, 1);
    divideBox(initialBox, iterations);

    addObjectToScene(sponge);
}

function updateControlValues() {
    if (selectedObject) {
        document.getElementById('rotationX').value = THREE.MathUtils.radToDeg(selectedObject.rotation.x);
        document.getElementById('rotationY').value = THREE.MathUtils.radToDeg(selectedObject.rotation.y);
        document.getElementById('rotationZ').value = THREE.MathUtils.radToDeg(selectedObject.rotation.z);
        document.getElementById('scale').value = selectedObject.scale.x;
    }
}

function toggleWireframe() {
    isWireframe = !isWireframe;
    objects.forEach(obj => {
        obj.material.wireframe = isWireframe;
    });
}

document.getElementById('addCube').addEventListener('click', addCube);
document.getElementById('addSphere').addEventListener('click', addSphere);
document.getElementById('addCylinder').addEventListener('click', addCylinder);
document.getElementById('addCone').addEventListener('click', addCone);
document.getElementById('addTorus').addEventListener('click', addTorus);
document.getElementById('addPrism').addEventListener('click', addPrism);
document.getElementById('addOctahedron').addEventListener('click', addOctahedron);
document.getElementById('addTorusKnot').addEventListener('click', addTorusKnot);
document.getElementById('addHyperCube').addEventListener('click', addHyperCube);
document.getElementById('addDodecahedron').addEventListener('click', addDodecahedron);
document.getElementById('addStellatedDodecahedron').addEventListener('click', addStellatedDodecahedron);
document.getElementById('addMengerSponge').addEventListener('click', () => addMengerSponge(3));
document.getElementById('toggleWireframe').addEventListener('click', toggleWireframe);
document.getElementById('toggleControls').addEventListener('click', function() {
    const controlsContent = document.querySelector('.controls-content');
    controlsContent.classList.toggle('hidden');
});

document.getElementById('rotationX').addEventListener('input', (e) => {
    if (selectedObject) {
        selectedObject.rotation.x = THREE.MathUtils.degToRad(parseFloat(e.target.value));
    }
});

document.getElementById('rotationY').addEventListener('input', (e) => {
    if (selectedObject) {
        selectedObject.rotation.y = THREE.MathUtils.degToRad(parseFloat(e.target.value));
    }
});

document.getElementById('rotationZ').addEventListener('input', (e) => {
    if (selectedObject) {
        selectedObject.rotation.z = THREE.MathUtils.degToRad(parseFloat(e.target.value));
    }
});

document.getElementById('scale').addEventListener('input', (e) => {
    if (selectedObject) {
        const scale = parseFloat(e.target.value);
        selectedObject.scale.set(scale, scale, scale);
    }
});

// Auto-rotation controls
document.getElementById('autoRotateX').addEventListener('change', (e) => {
    autoRotation.x = e.target.checked;
});

document.getElementById('autoRotateY').addEventListener('change', (e) => {
    autoRotation.y = e.target.checked;
});

document.getElementById('autoRotateZ').addEventListener('change', (e) => {
    autoRotation.z = e.target.checked;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Ray caster for object selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        updateControlValues();
    }
});

let isDragging = false;
let offset = new THREE.Vector3();
let previousMousePosition = {
x: 0,
y: 0
};

function getIntersectionPoint(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    // Buat bidang yang sejajar dengan kamera
    const plane = new THREE.Plane(camera.position.clone().normalize(), 0);
    const intersection = new THREE.Vector3();
    
    raycaster.ray.intersectPlane(plane, intersection);
    return intersection;
}

renderer.domElement.addEventListener('mousedown', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
        selectedObject = intersects[0].object;
        isDragging = true;
        
        const intersectionPoint = getIntersectionPoint(event);
        offset.copy(intersectionPoint).sub(selectedObject.position);
        
        updateControlValues();
        updateSelectionUI();
        updateControlsState();
    }

    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

renderer.domElement.addEventListener('mousemove', (event) => {
    if (isDragging && selectedObject) {
        const intersectionPoint = getIntersectionPoint(event);
        
        // Pindahkan objek dengan mempertimbangkan offset
        selectedObject.position.copy(intersectionPoint.sub(offset));
    }
});

// Event listener untuk mouse up
renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

// Event listener untuk mouse leave
renderer.domElement.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Animation loop with auto-rotation
function animate() {
    requestAnimationFrame(animate);

    if (selectedObject) {
        if (autoRotation.x) {
            selectedObject.rotation.x += THREE.MathUtils.degToRad(
                parseFloat(document.getElementById('rotateSpeedX').value)
            );
        }
        if (autoRotation.y) {
            selectedObject.rotation.y += THREE.MathUtils.degToRad(
                parseFloat(document.getElementById('rotateSpeedY').value)
            );
        }
        if (autoRotation.z) {
            selectedObject.rotation.z += THREE.MathUtils.degToRad(
                parseFloat(document.getElementById('rotateSpeedZ').value)
            );
        }

        if (autoRotation.x || autoRotation.y || autoRotation.z) {
            updateControlValues();
        }
    }

    renderer.render(scene, camera);
}
animate();