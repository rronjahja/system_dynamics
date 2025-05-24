import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Simple color palette for up to 5 products
const productColors = [0x4b9cd3, 0x65c18c, 0xffd166, 0xfa5252, 0xaf8cf7];

export default function Inventory3D({ products, echelons, simDays, inventoryHistory }) {
    const mountRef = useRef();

    useEffect(() => {
        if (!mountRef.current || !inventoryHistory) return;

        mountRef.current.innerHTML = "";

        // Scene setup
        const width = 420;
        const height = 340;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#eef4fb");

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(6, 16, 24);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Add orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.screenSpacePanning = false;
        controls.minDistance = 10;
        controls.maxDistance = 80;

        // Lights
        const light = new THREE.DirectionalLight(0xffffff, 1.2);
        light.position.set(12, 32, 20);
        scene.add(light);

        // Axes grid
        const grid = new THREE.GridHelper(18, 9, 0xbbbbbb, 0xbbbbbb);
        scene.add(grid);

        // Draw inventories: z = echelon, x = product, y = inventory
        for (let e = 0; e < echelons.length; e++) {
            for (let p = 0; p < products.length; p++) {
                const y = inventoryHistory[e][p][inventoryHistory[e][p].length - 1];
                const geometry = new THREE.BoxGeometry(0.9, Math.max(1, y / 25), 0.9);
                const material = new THREE.MeshPhongMaterial({ color: productColors[p % productColors.length] });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set((p - (products.length - 1) / 2) * 2.2, (Math.max(1, y / 25)) / 2, (e - (echelons.length - 1) / 2) * 3);
                scene.add(cube);

                // Label text as sprite
                const label = makeTextSprite(`${products[p].name}\n@${echelons[e].name}\n${Math.round(y)}`);
                label.position.set((p - (products.length - 1) / 2) * 2.2, (Math.max(1, y / 25)) + 0.8, (e - (echelons.length - 1) / 2) * 3);
                scene.add(label);
            }
        }

        // Animate controls for interactivity
        function animate() {
            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        // Clean up
        return () => {
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, [products, echelons, inventoryHistory]);

    return (
        <div ref={mountRef}></div>
    );
}

// Helper: create text as canvas texture sprite
function makeTextSprite(message) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = "bold 15px Arial";
    const lines = message.split("\n");
    const width = 140, height = 44;
    canvas.width = width;
    canvas.height = height * lines.length;
    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.fillRect(0, 0, width, canvas.height);
    ctx.fillStyle = "#333";
    lines.forEach((line, i) => ctx.fillText(line, 4, 18 + i * height));
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(1.6, 0.55 * lines.length, 1.0);
    return sprite;
}
