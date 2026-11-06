const http = require("http");
const { exec } = require("child_process");

const PORT = 3001;
const HOST = "localhost";

const HEALTH = "http://" + HOST + ":" + PORT + "/api/health";
const WEB = "http://" + HOST + ":" + PORT;

let browserOpened = false;
let lastStatus = null;
let monitoring = false;
let stopping = false;

console.log("");
console.log("=======================================================");
console.log("🚀 FaceCheck Frontend");
console.log("=======================================================");
console.log("");
console.log("📡 Backend Health: " + HEALTH);
console.log("🌐 Web: " + WEB);
console.log("");
console.log("ℹ️ Frontend sẽ tự động khởi động Backend cho bạn.");
console.log("");

// Auto-start backend
const path = require('path');
const { spawn } = require('child_process');
let backendProcess = null;

function startBackend() {
    console.log("🚀 Đang khởi động Backend...");
    const serverJsPath = path.join(__dirname, '..', 'backend', 'src', 'server.js');
    backendProcess = spawn('node', [serverJsPath], {
        cwd: path.join(__dirname, '..', 'backend'),
        stdio: 'inherit'
    });

    backendProcess.on('close', (code) => {
        console.log(`🔴 Backend đã đóng.`);
        process.exit(code || 0);
    });
}

/**
 * Kiểm tra Backend
 */
function checkServer(callback) {
    let finished = false;

    function finish(status) {
        if (finished) {
            return;
        }

        finished = true;
        callback(status);
    }

    const request = http.get(
        {
            hostname: HOST,
            port: PORT,
            path: "/api/health",
            timeout: 2000
        },
        function (response) {
            response.resume();

            if (response.statusCode === 200) {
                finish(true);
            } else {
                finish(false);
            }
        }
    );

    request.on("error", function () {
        finish(false);
    });

    request.on("timeout", function () {
        request.destroy();
        finish(false);
    });
}

/**
 * Mở trình duyệt
 */
function openBrowser() {
    if (browserOpened) {
        return;
    }

    browserOpened = true;

    console.log("🌐 Đang mở trình duyệt...");

    const mode = process.argv[2] || "default";
    let command = 'start "" "' + WEB + '"';
    if (mode === "chrome") {
        command = 'start chrome "' + WEB + '"';
    }

    exec(command, function (error) {
        if (error) {
            console.error(
                "⚠️ Không thể tự động mở trình duyệt:",
                error.message
            );
        }
    });
}

/**
 * Chờ Backend ONLINE
 */
function waitForServer() {
    if (stopping) {
        return;
    }

    process.stdout.write(".");

    checkServer(function (online) {
        if (online) {
            console.log("");
            console.log("");
            console.log("=======================================================");
            console.log("🟢 BACKEND ONLINE                                     ║");
            console.log("=======================================================");
            console.log("Health: " + HEALTH);
            console.log("Web: " + WEB);
            console.log("=======================================================");
            console.log("");

            lastStatus = true;

            openBrowser();

            monitorServer();

            return;
        }

        setTimeout(waitForServer, 1000);
    });
}

/**
 * Theo dõi Backend liên tục
 *
 * Backend tắt  -> OFFLINE
 * Backend chạy -> ONLINE
 */
function monitorServer() {
    if (monitoring) {
        return;
    }

    monitoring = true;

    setInterval(function () {
        if (stopping) {
            return;
        }

        checkServer(function (online) {
            if (online && lastStatus === false) {
                console.log("");
                console.log("🟢 BACKEND ONLINE LẠI");
                console.log("");
                lastStatus = true;
            }

            if (!online && lastStatus === true) {
                console.log("");
                console.log("🔴 BACKEND OFFLINE");
                console.log("");
                lastStatus = false;
            }
        });
    }, 3000);
}

/**
 * Dừng Frontend Launcher
 */
function shutdown() {
    if (stopping) {
        return;
    }

    stopping = true;

    console.log("");
    console.log("🛑 Stopping FaceCheck...");
    console.log("");

    if (backendProcess) {
        backendProcess.kill();
    }

    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/**
 * Bắt đầu
 */
checkServer(function (online) {
    if (online) {
        console.log("🟢 Backend đã chạy sẵn. Bỏ qua bước khởi động lại.");
        waitForServer();
    } else {
        startBackend();
        waitForServer();
    }
});