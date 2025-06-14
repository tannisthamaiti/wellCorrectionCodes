import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const VoxelViewer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // === Scene Setup ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // === Lights ===
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    scene.add(light);

    // === Formation Color Map ===
    const formationColors = {
      Sandstone: 0xffcc66,
      Shale: 0x666666,
      Limestone: 0x99ccff,
      Dolomite: 0xff99cc,
    };

    // === Load JSON and Add Voxels ===
    fetch("/voxels_with_latlong.json")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((voxel) => {
          const color = formationColors[voxel.formation] || 0xffffff;
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshLambertMaterial({ color });
          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(voxel.x, voxel.y, voxel.z);
          scene.add(cube);
        });
      });

    camera.position.set(10, 10, 10);
    controls.update();

    // === Render Loop ===
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // === Cleanup on Unmount ===
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100vh", overflow: "hidden" }}
    />
  );
};

export default VoxelViewer;
