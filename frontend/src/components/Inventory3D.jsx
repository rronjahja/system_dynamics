import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Inventory3D({ inventory }) {
    const mountRef = useRef();

    useEffect(() => {
        if (!mountRef.current || !inventory) return;

        // Clear previous scene
        mountRef.current.innerHTML = "";

        const width = 400, height = 300;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Visualize as a bar for each day
        inventory.forEach((val, i) => {
            const geometry = new THREE.BoxGeometry(0.7, val / 20, 0.7);
            const material = new THREE.MeshPhongMaterial({ color: 0x4b9cd3 });
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(i * 1.2 - 10, (val / 40), 0);
            scene.add(cube);
        });

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 50, 50);
        scene.add(light);

        camera.position.z = 18;
        camera.position.y = 8;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);

        // Cleanup
        return () => {
            renderer.dispose();
            // Remove canvas element
            if (renderer.domElement && renderer.domElement.parentNode) {
                renderer.domElement.parentNode.removeChild(renderer.domElement);
            }
        };
    }, [inventory]);
    return (
        <div ref={mountRef}></div>
    );
}
