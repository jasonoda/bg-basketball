import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import gsap from "gsap";
import * as CANNON from "cannon-es";
import cannonDebugger from "cannon-es-debugger";
// import { thickness } from "three/tsl";

export class Scene {
	setUp(e) {
		this.e = e;
	}

	buildScene() {
		this.mainCont = new THREE.Group();
		this.e.scene3D.add(this.mainCont);

		this.dl_shad = new THREE.DirectionalLight(0xffffff, 8);
		// this.dl_shad.position.x=5;
		this.dl_shad.position.y = 5;
		this.dl_shad.position.z = 11;
		this.mainCont.add(this.dl_shad);

		this.dl_shad.castShadow = true;

		//-----------------------------------------

		this.pointLight = new THREE.PointLight(0xffffff, 18);
		this.pointLight.position.x = 0;
		this.pointLight.position.y = 2;
		this.pointLight.position.z = 2;
		this.pointLight.decay = 1.75;
		this.mainCont.add(this.pointLight);

		//-----------------------------------------

		this.dl_shad.shadow.mapSize.width = 4096 / 4;
		this.dl_shad.shadow.mapSize.height = 4096 / 4;
		// // this.dl_shad.shadow.bias = .001;

		this.e.sSize = 14;
		this.dl_shad.shadow.camera.near = 0.1;
		this.dl_shad.shadow.camera.far = 180;
		this.dl_shad.shadow.camera.left = -this.e.sSize;
		this.dl_shad.shadow.camera.right = this.e.sSize;
		this.dl_shad.shadow.camera.top = this.e.sSize;
		this.dl_shad.shadow.camera.bottom = -this.e.sSize;
		this.dl_shad.shadow.radius = 2;

		// const shadowHelper = new THREE.CameraHelper(this.dl_shad.shadow.camera);
		// this.mainCont.add(shadowHelper);

		// ambient light

		this.ambLight = new THREE.AmbientLight(0xffffff, 3.25);
		this.mainCont.add(this.ambLight);

		//---PLAYER------------------------------------------------------------------------------------------------------

		this.playerCont = new THREE.Group();
		this.mainCont.add(this.playerCont);
		this.playerCont.position.y = 0;
		this.playerCont.position.z = 0;
		this.playerCont.position.x = 0;

		//---SCENE------------------------------------------------------------------------------------------------------

		var geometry = new THREE.BoxGeometry();
		var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
		this.box = new THREE.Mesh(geometry, material);
		this.box.castShadow = true;
		this.box.receiveShadow = true;
		this.box.position.y = 0.5;
		this.box.scale.x = 0.1;
		this.box.scale.z = 0.1;
		this.box.scale.y = 11;
		// this.mainCont.add(this.box);

		//---------------------------------------

		// reflection

		geometry = new THREE.PlaneGeometry(32, 32);

		if (this.e.mobile === true) {
			this.reflectiveFloor = new Reflector(geometry, {
				color: new THREE.Color(0x888888),
				textureWidth: window.innerWidth * window.devicePixelRatio * 0.25,
				textureHeight: window.innerHeight * window.devicePixelRatio * 0.25,
			});
		} else {
			this.reflectiveFloor = new Reflector(geometry, {
				color: new THREE.Color(0x888888),
				textureWidth: window.innerWidth * window.devicePixelRatio * 0.5,
				textureHeight: window.innerHeight * window.devicePixelRatio * 0.5,
			});
		}

		this.reflectiveFloor.material.transparent = true;
		this.reflectiveFloor.material.opacity = 0.5;
		this.reflectiveFloor.material.blending = THREE.NormalBlending;
		this.reflectiveFloor.material.depthWrite = false;

		this.reflectiveFloor.rotation.x = this.e.u.ca(-90);
		this.reflectiveFloor.position.y = 0.135;

		this.mainCont.add(this.reflectiveFloor);

		//---------------------------------------

		// court

		this.adMobile = [];
		this.adDesktop = [];

		this.court = this.e.court.clone();
		this.court.position.z = 13.2 - 0.14;
		this.mainCont.add(this.court);

		this.court.traverse((object) => {
			if (object.isMesh) {
				if (object.name === "glass" || object.name === "seatBackPurple2") {
					object.material.envMap = this.e.reflectionTexture;
					object.material.metalness = 0.5;
					object.material.roughness = 0;
				} else if (
					object.name === "courtRedOutside" ||
					object.name === "courtLines" ||
					object.name === "courtLines2" ||
					object.name === "floor"
				) {
					object.material.envMap = this.e.reflectionTexture;
					object.material.metalness = 0.5;
					object.material.roughness = 0;
					object.material.transparent = true;
					object.material.opacity = 0.7;
				} else if (object.name === "courtWood") {
					object.material.envMap = this.e.reflectionTexture;
					object.material.metalness = 0.5;
					object.material.roughness = 0;
					object.material.transparent = true;
					object.material.opacity = 0.8;
				} else if (object.name === "carpet") {
					object.material.envMap = this.e.reflectionTexture;
					object.material.metalness = 0.125;
					object.material.roughness = 0.25;
				} else if (object.name === "hoopMetal") {
					object.material.envMap = this.e.reflectionTexture;
					object.material.metalness = 1;
					object.material.roughness = 0.5;
				}
				if (object.name === "Court_Ground_1") {
					object.material.envMap = this.e.reflectionTexture;
				} else if (object.name === "hoopStand_1") {
					object.material.envMap = this.e.reflectionTexture;
				} else if (object.name === "courtRedOutside") {
					this.changeTexture = object.material;
				} else if (object.name === "net") {
					this.net = object;
				}

				if (
					object.name === "adBacks" ||
					object.name === "adPictures_1" ||
					object.name === "adPictures_2"
				) {
					this.adDesktop.push(object);
				}
			} else {
				// console.log(object.name);

				if (
					object.name === "adMobile1" ||
					object.name === "adMobile2" ||
					object.name === "adMobile3" ||
					object.name === "adMobile4" ||
					object.name === "adMobile5"
				) {
					this.adMobile.push(object);
				}
			}
		});

		if (this.e.mobile === true) {
			for (var i = 0; i < this.adDesktop.length; i++) {
				console.log(this.adDesktop[i].name);
				this.adDesktop[i].position.y -= 1000;
				this.adDesktop[i].position.x -= 10000;
			}
		} else {
			for (var i = 0; i < this.adMobile.length; i++) {
				this.adMobile[i].position.y -= 1000;
				this.adMobile[i].position.x -= 10000;
			}
		}

		//---------------------------------------

		this.count = 0;
		this.action = "start";

		//---------------------------------------

		this.world = new CANNON.World();
		this.world.gravity.set(0, -9.82, 0);

		this.cannonDebug = cannonDebugger(this.e.scene3D, this.world, {
			color: 0xff0000,
		});

		const bouncyMaterial = new CANNON.Material("bouncyMaterial");
		bouncyMaterial.restitution = 0.8;
		bouncyMaterial.friction = 0;

		this.balls = [];

		for (var i = 0; i < 5; i++) {
			// ball shape

			this.ballShape = new CANNON.Sphere(0.2);
			let ballBody = new CANNON.Body({
				mass: 1,
				shape: this.ballShape,
				position: new CANNON.Vec3(1000, 5, 0),
				material: bouncyMaterial,
			});
			this.world.addBody(ballBody);

			ballBody.angularDamping = 0.1;

			ballBody.type = CANNON.Body.STATIC;

			// ball

			this.ball = this.e.ball.clone();
			this.ball.position.y = 3.3;
			this.mainCont.add(this.ball);

			ballBody.ball = this.ball;
			this.ball.ballBody = ballBody;

			ballBody.name = "ball" + i;

			this.hoopSoundDelay = 0;

			// event listener

			ballBody.addEventListener("collide", (event) => {
				let ballBody = event.target;

				// console.log(event.body)

				if (event.body.bType !== undefined) {
					if (event.body.bType === "hoop") {
						if (this.hoopSoundDelay <= 0 && ballBody.velocity.y < -1) {
							this.e.s.p("hoop");
							this.hoopSoundDelay = 0.2;
						}
					} else if (event.body.bType === "backboard") {
						this.e.s.p("backboard");
					} else if (event.body.bType === "wall") {
						this.e.s.p("backboard");
					} else if (event.body.bType === "floor") {
						if (ballBody.velocity.y < -1) {
							var vol = -ballBody.velocity.y / 10;
							this.e.s.p("bounce1", vol);
						}
					}
				}
			});

			// array

			this.balls.push(ballBody);
		}

		this.curBall = 0;

		// backboard

		const floorMaterial = new CANNON.Material("backboardMaterial");
		floorMaterial.restitution = 0.8;
		floorMaterial.friction = 0;

		this.floorShape = new CANNON.Plane();
		this.floorBody = new CANNON.Body({
			mass: 0,
			shape: this.floorShape,
			material: floorMaterial,
		});
		this.floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
		this.floorBody.position.y = 0.12;
		this.world.addBody(this.floorBody);
		this.floorBody.bType = "floor";

		const backboardMaterial = new CANNON.Material("backboardMaterial");
		backboardMaterial.restitution = 0;
		backboardMaterial.friction = 0;

		// backboard

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.84, 0.6, 0.1));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0, 3.5, -0.55),
			material: backboardMaterial,
		});
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "backboard";

		// bottom base

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.55, 0.4, 0.74));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0, 0.52, -3.5),
			material: backboardMaterial,
		});
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "wall";

		// top base

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.3, 1, 0.54));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0, 1.9, -3.5),
			material: backboardMaterial,
		});
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "wall";

		// hoop neck

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.14, 0.1, 0.1));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0, 3.06, -0.35),
			material: backboardMaterial,
		});
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "wall";

		// wall back

		this.boxShape = new CANNON.Box(new CANNON.Vec3(14, 5, 0.1));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0, 2.5, -10.5),
			material: backboardMaterial,
		});
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "wall";

		// wall right

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.1, 5, 14));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(13.5, 2.5, 0),
			material: backboardMaterial,
		});
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "wall";

		// wall left

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.1, 5, 14));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(-13.5, 2.5, 0),
			material: backboardMaterial,
		});
		this.world.addBody(this.boxBody);

		// hoop

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.12, 0.02, 0.02));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0, 3.15, 0.23),
			material: backboardMaterial,
		});
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "hoop";

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.12, 0.02, 0.02));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0.25, 3.15, -0.01),
			material: backboardMaterial,
		});
		this.boxBody.quaternion.setFromEuler(0, this.e.u.ca(90), 0);
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "hoop";

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.12, 0.02, 0.02));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(-0.25, 3.15, -0.01),
			material: backboardMaterial,
		});
		this.boxBody.quaternion.setFromEuler(0, this.e.u.ca(90), 0);
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "hoop";

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.12, 0.02, 0.02));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(-0.17, 3.15, 0.17),
			material: backboardMaterial,
		});
		this.boxBody.quaternion.setFromEuler(0, this.e.u.ca(-45), 0);
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "hoop";

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.12, 0.02, 0.02));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0.17, 3.15, 0.17),
			material: backboardMaterial,
		});
		this.boxBody.quaternion.setFromEuler(0, this.e.u.ca(45), 0);
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "hoop";

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.12, 0.02, 0.02));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(-0.17, 3.15, -0.2),
			material: backboardMaterial,
		});
		this.boxBody.quaternion.setFromEuler(0, this.e.u.ca(45), 0);
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "hoop";

		this.boxShape = new CANNON.Box(new CANNON.Vec3(0.12, 0.02, 0.02));
		this.boxBody = new CANNON.Body({
			mass: 0,
			shape: this.boxShape,
			position: new CANNON.Vec3(0.17, 3.15, -0.2),
			material: backboardMaterial,
		});
		this.boxBody.quaternion.setFromEuler(0, this.e.u.ca(-45), 0);
		this.world.addBody(this.boxBody);
		this.boxBody.bType = "hoop";

		//---------------------------------------

		this.hoopTriggerShape = new CANNON.Box(new CANNON.Vec3(0.3, 0.01, 0.3));
		this.hoopTriggerBody = new CANNON.Body({
			mass: 0,
			shape: this.hoopTriggerShape,
			position: new CANNON.Vec3(0, 2.8, 0),
			isTrigger: true,
		});
		this.world.addBody(this.hoopTriggerBody);

		//---------------------------------------

		document.addEventListener("touchstart", () => {
			if (this.e.mobile === true) {
				this.click();
			}
		});

		document.addEventListener("click", () => {
			if (this.e.mobile === false) {
				this.click();
			}
		});

		//---------------------------------------

		this.startButton = document.getElementById("startButton");

		this.startButton.addEventListener("touchstart", () => {
			if (this.e.mobile === true) {
				if (this.action === "start button wait") {
					this.e.s.p("click");
					gtag("event", "play_count", {
						device_type: "mobile",
					});

					this.action = "start move";
				}
			}
		});

		this.startButton.addEventListener("click", () => {
			if (this.e.mobile === false) {
				if (this.action === "start button wait") {
					this.e.s.p("click");
					gtag("event", "play_count", {
						device_type: "desktop",
					});

					this.action = "start move";
				}
			}
		});

		//---------------------------------------

		this.scoreDiv = document.getElementById("score");
		this.results = document.getElementById("results");

		gsap.to(document.getElementById("scoreTotal"), {
			color: "white",
			duration: 0.8,
			yoyo: true,
			repeat: -1,
			ease: "sine.inOut",
		});
		gsap.to(document.getElementById("scoreTop"), {
			color: "white",
			duration: 0.8,
			yoyo: true,
			repeat: -1,
			ease: "sine.inOut",
		});

		//---------------------------------------
	}

	click() {
		if (this.action === "hor meter") {
			this.action = "hor meter save";
		} else if (this.action === "vert meter") {
			this.action = "vert meter save";
		}
	}

	reset() {
		this.swishTime = 0;

		this.curBall = 0;
		this.round = 0;
		this.basketsMade = 0;
		this.basketsShot = 0;
	}

	update() {
		this.hoopSoundDelay -= this.e.dt;

		// this.cannonDebug.update();
		this.world.step(1 / 60, this.e.dt, 10);

		this.scoreDiv.innerHTML = this.basketsMade + "/" + this.basketsShot;

		this.swishTime -= this.e.dt;

		for (var i = 0; i < this.balls.length; i++) {
			this.balls[i].ball.position.copy(this.balls[i].position);
			this.balls[i].ball.quaternion.copy(this.balls[i].quaternion);

			this.ballPos = this.balls[i].position;
			this.triggerPos = this.hoopTriggerBody.position;

			if (
				Math.abs(this.ballPos.x - this.triggerPos.x) < 0.3 &&
				Math.abs(this.ballPos.y - this.triggerPos.y) < 0.05 &&
				Math.abs(this.ballPos.z - this.triggerPos.z) < 0.3 &&
				this.balls[i].velocity.y < 0
			) {
				if (this.swishTime <= 0) {
					this.swishTime = 0.4;
					this.swish();
				}
			}

			this.velocity = this.balls[i].velocity;

			this.spinFactor = 5;
			this.balls[i].angularVelocity.set(
				this.velocity.z * this.spinFactor,
				0,
				-this.velocity.x * this.spinFactor
			);
		}

		if (this.useLerp === true) {
			this.e.camContY.rotation.y = this.e.u.lerp(
				this.e.camContY.rotation.y,
				this.targetLerp,
				0.05
			);
		}

		if (this.action === "start") {
			this.e.camera.position.z = 20;

			this.e.camContY.rotation.y = this.e.u.ca(15);
			gsap.to(this.e.camContY.rotation, {
				y: this.e.u.ca(-15),
				duration: 12,
				yoyo: true,
				repeat: -1,
				ease: "sine.inOut",
			});

			this.reset();

			this.action = "start button wait";
		} else if (this.action === "start move") {
			this.reset();

			gsap.killTweensOf(this.e.camContY.rotation);
			gsap.to(this.e.camera.position, {
				z: 11,
				duration: 2,
				ease: "expo.inOut",
			});
			gsap.to(this.e.camContY.rotation, {
				y: this.e.u.ca(90),
				duration: 2,
				ease: "expo.inOut",
			});

			this.e.s.p("whistle");

			gsap.to(this.startButton, { opacity: 0, duration: 0.5, ease: "linear" });
			this.startButton.style.pointerEvents = "none";
			gsap.to(this.results, { opacity: 0, duration: 0.5, ease: "linear" });

			this.action = "start wait";
		} else if (this.action === "start wait") {
			this.count += this.e.dt;
			if (this.count > 2) {
				this.targetLerp = this.e.u.ca(89.9);
				this.useLerp = true;

				gsap.to(document.getElementById("meterDiv"), {
					opacity: 1,
					duration: 0.5,
					ease: "linear",
				});
				gsap.to(document.getElementById("score"), {
					opacity: 1,
					duration: 0.5,
					ease: "linear",
				});

				gsap.to(document.getElementById("instructions"), {
					opacity: 1,
					duration: 0.5,
					ease: "linear",
				});

				this.action = "set ball";
				this.count = 0;
			}
		} else if (this.action === "set ball") {
			this.e.s.p("catch");

			if (this.curBall >= 3) {
				this.waitTime = 2;

				this.curBall = 0;

				this.round += 1;

				if (this.round === 1) {
					this.targetLerp = this.e.u.ca(45);
				} else if (this.round === 2) {
					this.targetLerp = this.e.u.ca(0);
				} else if (this.round === 3) {
					this.targetLerp = this.e.u.ca(-45);
				} else if (this.round === 4) {
					this.targetLerp = this.e.u.ca(-89.9);
				}
			} else {
				this.waitTime = 0;
			}

			if (this.round === 5) {
				this.count = 0;
				this.action = "end";
			} else {
				this.ballBody = this.balls[this.curBall];
				this.curBall += 1;

				this.ballBody.type = CANNON.Body.STATIC;

				this.ballBody.velocity.set(0, 0, 0);
				this.ballBody.angularVelocity.set(0, 0, 0);

				let worldPosition = new THREE.Vector3();
				this.e.startBox.getWorldPosition(worldPosition);
				this.ballBody.position.set(
					worldPosition.x,
					worldPosition.y - 1,
					worldPosition.z
				);

				this.ball.rotation.y = this.e.camContY.rotation.y - this.e.u.ca(-90);

				this.action = "wait time";
			}

			//-------------------------------------------------
		} else if (this.action === "wait time") {
			this.waitTime -= this.e.dt;
			if (this.waitTime <= 0) {
				this.action = "set hor meter";
			}
		} else if (this.action === "set hor meter") {
			let worldPosition = new THREE.Vector3();
			this.e.startBox.getWorldPosition(worldPosition);
			this.ballBody.position.set(
				worldPosition.x,
				worldPosition.y - 1,
				worldPosition.z
			);

			// document.getElementById("meterVertDiv").style.display="block"
			document.getElementById("meterHorDot").style.display = "block";
			document.getElementById("meterVertDot").style.display = "none";
			this.action = "hor meter";
		} else if (this.action === "hor meter") {
			this.moveHorDot();
		} else if (this.action === "hor meter save") {
			this.horNum = this.horNum;
			this.action = "set vert meter";

			//-------------------------------------------------
		} else if (this.action === "set vert meter") {
			let worldPosition = new THREE.Vector3();
			this.e.startBox.getWorldPosition(worldPosition);
			this.ballBody.position.set(
				worldPosition.x,
				worldPosition.y - 1,
				worldPosition.z
			);

			document.getElementById("meterVertDot").style.display = "block";
			this.action = "vert meter";
		} else if (this.action === "vert meter") {
			this.moveVertDot();
		} else if (this.action === "vert meter save") {
			let worldPosition = new THREE.Vector3();
			this.e.startBox.getWorldPosition(worldPosition);
			this.ballBody.position.set(
				worldPosition.x,
				worldPosition.y - 1,
				worldPosition.z
			);

			this.vertNum = this.vertNum;
			this.action = "shoot";

			//-------------------------------------------------
		} else if (this.action === "shoot") {
			gsap.to(document.getElementById("instructions"), {
				opacity: 0,
				duration: 0.5,
				ease: "linear",
			});

			this.basketsShot += 1;

			// this.horNum=0;
			// this.vertNum=0;

			this.ballBody.type = CANNON.Body.DYNAMIC;

			const ballPos = this.ballBody.position;
			const hoopPos = new CANNON.Vec3(0, 3, 0);
			const direction = new CANNON.Vec3(
				hoopPos.x - ballPos.x,
				hoopPos.y - ballPos.y,
				hoopPos.z - ballPos.z
			);

			const length = Math.sqrt(
				direction.x ** 2 + direction.y ** 2 + direction.z ** 2
			);
			direction.x /= length;
			direction.y /= length;
			direction.z /= length;

			// Get the camera's rotation in radians
			const cameraRotationY = this.e.camContY.rotation.y;

			this.mult = 1.4;
			const forcePower = 4 * this.mult;

			// Create a rotation matrix based on the camera's Y rotation
			const rotationMatrix = new THREE.Matrix4().makeRotationY(cameraRotationY);

			// Create a vector representing the horizontal and vertical offsets
			const offsetVector = new THREE.Vector3(
				this.horNum * 0.02,
				0,
				this.vertNum * 0.02
			);

			// Apply the camera's rotation to the offset vector
			offsetVector.applyMatrix4(rotationMatrix);

			// Adjust the force based on the rotated offset vector
			direction.x *= forcePower;
			direction.x += offsetVector.x;
			direction.y *= forcePower + (23.5 + -this.vertNum * 0.2) * this.mult;
			direction.z *= forcePower;
			direction.z += offsetVector.z;

			// Apply the force
			this.ballBody.applyImpulse(direction, ballPos);

			this.action = "shoot wait";
		} else if (this.action === "shoot wait") {
			this.count += this.e.dt;
			if (this.count > 0.5) {
				this.count = 0;
				this.action = "set ball";
			}
		} else if (this.action === "end") {
			this.count += this.e.dt;
			if (this.count > 4) {
				this.count = 0;
				this.action = "end show";
			}
		} else if (this.action === "end show") {
			this.useLerp = false;

			this.e.s.p("buzzer");

			gsap.to(document.getElementById("meterDiv"), {
				opacity: 0,
				duration: 0.5,
				ease: "linear",
			});
			gsap.to(document.getElementById("score"), {
				opacity: 0,
				duration: 0.5,
				ease: "linear",
			});

			gsap.to(this.e.camera.position, {
				z: 20,
				duration: 4,
				ease: "sine.inOut",
			});
			gsap.to(this.e.camContY.rotation, {
				y: this.e.u.ca(-15),
				duration: 4,
				ease: "sine.inOut",
			});

			document.getElementById("scoreTotal").innerHTML = this.basketsMade;

			gsap.to(this.results, { opacity: 1, duration: 0.5, ease: "linear" });
			gsap.to(this.startButton, { opacity: 1, duration: 0.5, ease: "linear" });
			this.startButton.src = "./src/images/playAgain.svg";
			this.startButton.style.pointerEvents = "auto";

			this.count = 0;
			this.action = "end wait 1";
		} else if (this.action === "end wait 1") {
			this.count += this.e.dt;
			if (this.count > 4) {
				this.count = 0;

				gsap.killTweensOf(this.e.camContY.rotation);
				gsap.to(this.e.camContY.rotation, {
					y: this.e.u.ca(15),
					duration: 12,
					yoyo: true,
					repeat: -1,
					ease: "sine.inOut",
				});

				this.action = "start button wait";
			}
		}

		this.mixer();

		this.dotSpeed = 0.016;
	}

	moveVertDot() {
		if (this.vertVars === undefined) {
			this.vertDir = "up";
			this.vertNum = 0;
			this.vertDot = document.getElementById("meterVertDot");
			this.vertCount = 0;
			this.vertVars = true;
		}

		this.vertCount += this.e.dt;
		if (this.vertCount > this.dotSpeed) {
			this.vertCount = 0;

			if (this.vertDir === "up") {
				this.vertNum -= 1;
				if (this.vertNum < -10) {
					this.vertDir = "down";
				}
			} else if (this.vertDir === "down") {
				this.vertNum += 1;
				if (this.vertNum > 10) {
					this.vertDir = "up";
				}
			}
		}

		this.vertDot.style.top = 90 + this.vertNum * 5 + "px";
	}

	moveHorDot() {
		if (this.horVars === undefined) {
			this.horDir = "up";
			this.horNum = 0;
			this.horDot = document.getElementById("meterHorDot");
			this.horCount = 0;
			this.horVars = true;
		}

		this.horCount += this.e.dt;
		if (this.horCount > this.dotSpeed) {
			this.horCount = 0;

			if (this.horDir === "up") {
				this.horNum -= 1;
				if (this.horNum < -10) {
					this.horDir = "down";
				}
			} else if (this.horDir === "down") {
				this.horNum += 1;
				if (this.horNum > 10) {
					this.horDir = "up";
				}
			}
		}

		this.horDot.style.left = 100 + this.horNum * 5 + "px";
	}

	swish() {
		console.log("net");
		console.log(this.net);

		this.e.s.p("swish");

		this.basketsMade += 1;

		// Create GSAP Timeline for the net animation
		const netTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });

		netTimeline.to(this.net.scale, {
			y: -0.2,
			duration: 0.2,
		});

		netTimeline.to(this.net.scale, {
			y: 1.05,
			duration: 0.3,
		});

		// netTimeline.to(this.net.scale, {
		//     y: .9,
		//     duration: 0.1
		// });

		// netTimeline.to(this.net.scale, {
		//     y: 1,
		//     duration: 0.05
		// });
	}

	mixer() {
		if (document.getElementById("mix").checked === true) {
			//-------------------------------------

			var c1_H = document.getElementById("c1_H").value;
			var c1_S = document.getElementById("c1_S").value;
			var c1_L = document.getElementById("c1_L").value;

			document.getElementById("c1_Color").value = this.e.u.hslToHex(
				c1_H,
				c1_S,
				c1_L
			);
			// this.changeTexture.color.setHex( "0x"+this.e.u.hslToHex(c1_H,c1_S,c1_L) );

			//-------------------------------------

			// var c2_H = document.getElementById("c2_H").value;
			// var c2_S = document.getElementById("c2_S").value;
			// var c2_L = document.getElementById("c2_L").value;

			// document.getElementById("c2_Color").value = this.e.u.hslToHex(c2_H,c2_S,c2_L);
			// // this.roofBars.material.color.setHex( "0x"+this.e.u.hslToHex(c2_H,c2_S,c2_L) );

			// //-------------------------------------

			// var c3_H = document.getElementById("c3_H").value;
			// var c3_S = document.getElementById("c3_S").value;
			// var c3_L = document.getElementById("c3_L").value;

			// document.getElementById("c3_Color").value = this.e.u.hslToHex(c3_H,c3_S,c3_L);
			// // this.roofEdge.material.color.setHex( "0x"+this.e.u.hslToHex(c3_H,c3_S,c3_L) );

			// //-------------------------------------

			// var c4_H = document.getElementById("c4_H").value;
			// var c4_S = document.getElementById("c4_S").value;
			// var c4_L = document.getElementById("c4_L").value;

			// document.getElementById("c4_Color").value = this.e.u.hslToHex(c4_H,c4_S,c4_L);
			// // this.ambLight.color.setHex( "0x"+this.e.u.hslToHex(c4_H,c4_S,c4_L) );

			// //-------------------------------------

			// var c5_H = document.getElementById("c5_H").value;
			// var c5_S = document.getElementById("c5_S").value;
			// var c5_L = document.getElementById("c5_L").value;

			// document.getElementById("c5_Color").value = this.e.u.hslToHex(c5_H,c5_S,c5_L);

			//-------------------------------------

			var num1 = document.getElementById("num1").value;
			var num2 = document.getElementById("num2").value;
			var num3 = document.getElementById("num3").value;

			this.changeTexture.metalness = num1 / 100;
			this.changeTexture.roughness = num2 / 100;
			// this.changeTexture.opacity = num3/100;

			// this.dl_shad.position.x = num1;
			// this.dl_shad.position.z = num2;
			// this.dl_shad.position.y = num3;
		}
	}
}
