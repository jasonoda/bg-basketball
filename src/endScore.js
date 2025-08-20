import gsap from "gsap";

export class EndScore {
	setUp(e) {
		this.e = e;
	}

	createFinalScoreOverlay(scoreValue, statsArray = []) {
		// Create black overlay
		const overlay = document.createElement('div');
		overlay.className = 'finalScoreOverlay';
		
		// Create score text
		const scoreText = document.createElement('div');
		scoreText.className = 'finalScoreText';
		scoreText.textContent = `${scoreValue.toLocaleString()}`;
		
		// Create stats container
		const statsContainer = document.createElement('div');
		statsContainer.className = 'finalScoreStatsContainer';
		
		// Create stats items dynamically from the array
		statsArray.forEach(statInfo => {
			const [label, count] = statInfo;
			const statItem = document.createElement('div');
			statItem.className = 'finalScoreStatItem';
			statItem.textContent = `${label}: ${count}`;
			statsContainer.appendChild(statItem);
		});
		
		overlay.appendChild(scoreText);
		overlay.appendChild(statsContainer);
		document.body.appendChild(overlay);
		
		// Animate overlay and score text with GSAP
		gsap.to(overlay, {
			duration: 0.8,
			opacity: 1,
			ease: "power2.out"
		});
		
		gsap.to(scoreText, {
			duration: 1.2,
			opacity: 1,
			scale: 1,
			ease: "back.out(1.7)"
		});
		
		// Add glowing animation
		gsap.to(scoreText, {
			duration: 2,
			color: "#FFFFFF",
			textShadow: "0 0 40px rgba(255, 255, 255, 0.9)",
			ease: "power2.inOut",
			yoyo: true,
			repeat: -1
		});
		
		// After 3 seconds, move score up and show stats
		setTimeout(() => {
			// Move score up
			gsap.to(scoreText, {
				duration: 1,
				top: "35%",
				ease: "power2.out"
			});
			
			// Fade in stats
			gsap.to(statsContainer, {
				duration: 1,
				opacity: 1,
				ease: "power2.out"
			});
		}, 3000);
		
		// Fade effect when game ends
		const fader = document.getElementById("fader");
		if (fader) {
			gsap.to(fader, { opacity: 0.5, duration: 0.1, ease: "linear" });
			gsap.to(fader, { opacity: 0, duration: 1, ease: "linear", delay: 0.1 });
		}
	}
}
