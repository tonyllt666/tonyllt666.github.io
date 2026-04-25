// ---------- 1. 获取所有图标和所有音频 ----------
const icons = document.querySelectorAll('.icon');
const allAudios = [];
for (let i = 1; i <= 9; i++) {
    const audio = document.getElementById(`sound${i}`);
    if (audio) allAudios.push(audio);
}

// ---------- 2. 音频解锁 ----------
let isAudioUnlocked = false;
function unlockAllAudios() {
    if (isAudioUnlocked) return;
    if (allAudios.length === 0) return;
    const testAudio = allAudios[0];
    testAudio.play().then(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
        isAudioUnlocked = true;
        console.log("✅ 音频已解锁！");
        const infoDiv = document.querySelector('.info');
        if (infoDiv) infoDiv.textContent = '';
    }).catch(e => {
        console.log("解锁失败，请点击页面任意位置", e);
    });
}
document.body.addEventListener('click', unlockAllAudios);
document.body.addEventListener('touchstart', unlockAllAudios);

// ---------- 3. 为每个图标绑定功能：悬停0.5秒换图 + 点击临时换图 + 音效 ----------
icons.forEach((icon) => {
    const idx = icon.getAttribute('data-index');   // 数字 1~9
    const audio = document.getElementById(`sound${idx}`);
    if (!audio) {
        console.warn(`未找到图标${idx}对应的音频`);
        return;
    }

  const originalImgPath = `images/icon${idx}.png`;                     // 原始图片
  const hoverImgPath   = `images/hoverImage/change icon${idx}.png`;   // 悬停图片（注意空格）
  const clickImgPath   = `images/changed/icon${idx}.png`;              // 如果你有点击图片文件夹，也改好              // 点击时临时显示的图片

    // 状态管理
    icon.originalSrc = originalImgPath;
    icon.hoverTimer = null;
    icon.isHovering = false;
    icon.isClickChanging = false;

    // 初始化显示原始图片
    if (icon.src !== originalImgPath) {
        icon.src = originalImgPath;
    }

    function restoreOriginalImage() {
        if (icon.isClickChanging) return;
        if (icon.src !== icon.originalSrc) {
            icon.src = icon.originalSrc;
        }
    }

    // 鼠标悬停：延迟0.5秒换图
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

    // 鼠标离开：清除定时器，恢复原图
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

    // 悬停播放音频（原有）
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