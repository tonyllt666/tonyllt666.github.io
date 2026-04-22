// ---------- 1. 获取所有图标和所有音频 ----------
const icons = document.querySelectorAll('.icon');
const allAudios = [];
for (let i = 1; i <= 9; i++) {
    const audio = document.getElementById(`sound${i}`);
    if (audio) allAudios.push(audio);
}

// ---------- 2. 音频解锁（因为浏览器不允许自动播放）----------
let isAudioUnlocked = false;

function unlockAllAudios() {
    if (isAudioUnlocked) return;
    if (allAudios.length === 0) return;
    // 尝试播放第一个音频然后立即暂停，用来“唤醒”音频通道
    const testAudio = allAudios[0];
    testAudio.play().then(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
        isAudioUnlocked = true;
        console.log("✅ 音频已解锁！现在可以把鼠标放到图标上听声音了");
        // 可选：改变提示文字
        const infoDiv = document.querySelector('.info');
        if (infoDiv) infoDiv.textContent = '';
    }).catch(e => {
        console.log("解锁失败，请点击页面任意位置", e);
    });
}

// 用户点击页面任意地方即可解锁（只需点一次）
document.body.addEventListener('click', unlockAllAudios);
document.body.addEventListener('touchstart', unlockAllAudios);  // 支持手机触摸

// ---------- 3. 为每个图标绑定悬停播放声音 ----------
icons.forEach(icon => {
    const idx = icon.getAttribute('data-index');  // 获取数字 1~9
    const audio = document.getElementById(`sound${idx}`);
 
    if (!audio) {
        console.warn(`未找到图标${idx}对应的音频`);
        return;
    }
 
    // 鼠标进入图标区域时播放声音
    icon.addEventListener('mouseenter', () => {
        if (!isAudioUnlocked) {
            console.log("");
            return;
        }
        // 重置播放位置，确保每次悬停都从头播放
        audio.currentTime = 0;
        audio.play().catch(err => console.log(`图标${idx}播放失败`, err));
    });
 
    // 鼠标离开时停止声音（可选，如果你希望悬停期间一直播放可以删掉这个事件）
    icon.addEventListener('mouseleave', () => {
        if (!isAudioUnlocked) return;
        audio.pause();
        audio.currentTime = 0;
    });
});
