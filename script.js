const icons = document.querySelectorAll('.icon');  /* colleet all icon audio elements */
const allAudios = [];
for (let i = 1; i <= 9; i++) {
    const audio = document.getElementById(`sound${i}`);
    if (audio) allAudios.push(audio);
}

let isAudioUnlocked = false;
function unlockAllAudios() {  /* unlock interactive audio */
    if (isAudioUnlocked) return;
    if (allAudios.length === 0) return;
    const testAudio = allAudios[0];
    testAudio.play().then(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
        isAudioUnlocked = true;
        console.log("audio unlocked");   /* audio debugging */
        const infoDiv = document.querySelector('.info');
        if (infoDiv) infoDiv.textContent = '';
    }).catch(e => {
        console.log("Audio unlocked failed. Click anywhere", e);
    });
}
document.body.addEventListener('click', unlockAllAudios);
document.body.addEventListener('touchstart', unlockAllAudios);

icons.forEach((icon) => {
    const idx = icon.getAttribute('data-index'); 
    const audio = document.getElementById(`sound${idx}`);
    if (!audio) {
        return;
    }

  const originalImgPath = `images/icon${idx}.png`;
  const hoverImgPath   = `images/hoverImage/change icon${idx}.png`;

    icon.originalSrc = originalImgPath;
    icon.hoverTimer = null;
    icon.isHovering = false;
    icon.isClickChanging = false;

    if (icon.src !== originalImgPath) {
        icon.src = originalImgPath;
    }

    function restoreOriginalImage() {
        if (icon.isClickChanging) return;
        if (icon.src !== icon.originalSrc) {
            icon.src = icon.originalSrc;
        }
    }

    icon.addEventListener('mouseenter', () => {
        icon.isHovering = true;
        if (icon.isClickChanging) return;

        if (icon.hoverTimer) clearTimeout(icon.hoverTimer);
        icon.hoverTimer = setTimeout(() => {
            if (icon.isHovering && !icon.isClickChanging) {
                if (icon.src !== hoverImgPath) {
                    icon.src = hoverImgPath;
                }
            }
            icon.hoverTimer = null;
        }, 500);
    });

    icon.addEventListener('mouseleave', () => {
        icon.isHovering = false;
        if (icon.hoverTimer) {
            clearTimeout(icon.hoverTimer);
            icon.hoverTimer = null;
        }
        if (!icon.isClickChanging) {
            restoreOriginalImage();
        }
    });

    icon.addEventListener('mouseenter', () => {
        if (!isAudioUnlocked) return;
        audio.currentTime = 0;
        audio.play().catch(err => console.log(`图标${idx}播放失败`, err));
    });
    icon.addEventListener('mouseleave', () => {
        if (!isAudioUnlocked) return;
        audio.pause();
        audio.currentTime = 0;
    });
});