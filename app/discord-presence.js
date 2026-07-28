"use strict";

var net = require("net");
var path = require("path");
function createDiscordPresence(_0x37569a) {
  _0x37569a = _0x37569a || {};
  var _0x4ef2f3 = String(_0x37569a.clientId || "");
  var _0x409df5 = _0x37569a.largeImageKey || "logogrande";
  var _0x345245 = _0x37569a.smallImageKey || "logochico";
  var _0x3e6dcd = _0x37569a.largeImageText || "discord.gg/spacehax";
  var _0x3521c7 = _0x37569a.smallImageText || "";
  var _0x3d11d9 = _0x37569a.buttonLabel || "Discord";
  var _0x8a0cc9 = _0x37569a.buttonUrl || "https://discord.gg/spacehax";
  var _0x1accd8 = _0x37569a.detailsLauncher || "En el launcher";
  var _0x47d75a = _0x37569a.detailsMenu || "En el menú";
  var _0x19f655 = _0x37569a.detailsPlaying || "Jugando";
  var _0x1831b9 = null;
  var _0x43410c = false;
  var _0x362bf2 = false;
  var _0x3a962b = false;
  var _0x536bda = Buffer.alloc(0);
  var _0xcb697c = Math.floor(Date.now() / 1000);
  var _0x2842fb = null;
  var _0x5092b9 = null;
  var _0x32d7d3 = false;
  var _0x49e3ac = "";
  function _0x1c8b2f(_0x3633f2, _0x4895fc) {
    var _0x16f7df = Buffer.from(JSON.stringify(_0x4895fc), "utf8");
    var _0x4fcc10 = Buffer.alloc(8);
    _0x4fcc10.writeInt32LE(_0x3633f2, 0);
    _0x4fcc10.writeInt32LE(_0x16f7df.length, 4);
    return Buffer.concat([_0x4fcc10, _0x16f7df]);
  }
  function _0x5a14e2(_0x213cbe, _0x39265f) {
    if (!_0x1831b9 || !_0x43410c) {
      return;
    }
    try {
      _0x1831b9.write(_0x1c8b2f(_0x213cbe, _0x39265f));
    } catch (_0x393fd1) {}
  }
  function _0xfdf2b9(_0x2955d7, _0x1c72b7) {
    _0x5a14e2(1, {
      cmd: _0x2955d7,
      args: _0x1c72b7 || {},
      nonce: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
    });
  }
  function _0x523f62(_0x43644d) {
    if (process.platform === "win32") {
      return "\\\\.\\pipe\\discord-ipc-" + _0x43644d;
    }
    var _0x569d93 = process.env.XDG_RUNTIME_DIR || process.env.TMPDIR || "/tmp";
    return path.join(_0x569d93, "discord-ipc-" + _0x43644d);
  }
  function _0x5ba743(_0x397ded) {
    if (_0x32d7d3 || _0x362bf2 || _0x43410c) {
      return;
    }
    if (!_0x4ef2f3) {
      return;
    }
    if (_0x397ded > 9) {
      _0x9a2d97();
      return;
    }
    _0x362bf2 = true;
    var _0x37ce54 = _0x523f62(_0x397ded);
    var _0x121b5d = net.createConnection(_0x37ce54);
    var _0x5f46ce = false;
    function _0x3bc8bd() {
      if (_0x5f46ce) {
        return;
      }
      _0x5f46ce = true;
      _0x362bf2 = false;
      try {
        _0x121b5d.destroy();
      } catch (_0x503c5f) {}
      _0x5ba743(_0x397ded + 1);
    }
    _0x121b5d.once("error", _0x3bc8bd);
    _0x121b5d.once("connect", function () {
      if (_0x5f46ce) {
        return;
      }
      _0x5f46ce = true;
      _0x362bf2 = false;
      _0x43410c = true;
      _0x1831b9 = _0x121b5d;
      _0x536bda = Buffer.alloc(0);
      _0x49e3ac = _0x4ef2f3;
      _0x121b5d.on("data", _0x528dab);
      _0x121b5d.on("close", _0x154783);
      _0x121b5d.on("error", function () {});
      _0x5a14e2(0, {
        v: 1,
        client_id: _0x4ef2f3,
      });
    });
  }
  function _0x154783() {
    _0x43410c = false;
    _0x3a962b = false;
    _0x1831b9 = null;
    if (!_0x32d7d3) {
      _0x9a2d97();
    }
  }
  function _0x528dab(_0x5cbe49) {
    _0x536bda = Buffer.concat([_0x536bda, _0x5cbe49]);
    while (_0x536bda.length >= 8) {
      var _0x1ac21e = _0x536bda.readInt32LE(0);
      var _0x5b7240 = _0x536bda.readInt32LE(4);
      if (_0x536bda.length < 8 + _0x5b7240) {
        break;
      }
      var _0x1927f1 = _0x536bda.slice(8, 8 + _0x5b7240).toString("utf8");
      _0x536bda = _0x536bda.slice(8 + _0x5b7240);
      var _0x70701b = null;
      try {
        _0x70701b = JSON.parse(_0x1927f1);
      } catch (_0x4d29cf) {
        continue;
      }
      if (_0x1ac21e === 1) {
        _0x40ec1d(_0x70701b);
      } else if (_0x1ac21e === 3) {
        _0x5a14e2(4, _0x70701b);
      }
    }
  }
  function _0x40ec1d(_0x377fa7) {
    if (!_0x377fa7) {
      return;
    }
    if (
      _0x377fa7.evt === "READY" ||
      (_0x377fa7.cmd === "DISPATCH" && _0x377fa7.evt === "READY")
    ) {
      _0x3a962b = true;
      if (_0x2842fb) {
        _0x354275(_0x2842fb);
      }
    }
  }
  function _0x9a2d97() {
    if (_0x32d7d3 || _0x5092b9) {
      return;
    }
    _0x5092b9 = setTimeout(function () {
      _0x5092b9 = null;
      _0x5ba743(0);
    }, 5000);
  }
  function _0x1034b1(_0x777d72) {
    _0x777d72 = _0x777d72 || {};
    var _0x127474 = {
      details: String(_0x777d72.details || _0x3e6dcd).slice(0, 128),
      assets: {
        large_image: _0x409df5,
        large_text: String(_0x777d72.largeText || _0x3e6dcd).slice(0, 128),
      },
      timestamps: {
        start: _0x777d72.startTimestamp || _0xcb697c,
      },
    };
    if (_0x777d72.state) {
      _0x127474.state = String(_0x777d72.state).slice(0, 128);
    }
    var _0x2683cd = _0x777d72.smallText || _0x3521c7;
    if (_0x345245) {
      _0x127474.assets.small_image = _0x345245;
      if (_0x2683cd) {
        _0x127474.assets.small_text = String(_0x2683cd).slice(0, 128);
      }
    }
    if (_0x8a0cc9) {
      _0x127474.buttons = [
        {
          label: String(_0x3d11d9).slice(0, 32),
          url: _0x8a0cc9,
        },
      ];
    }
    return _0x127474;
  }
  function _0x354275(_0x503585) {
    _0x2842fb = _0x503585;
    if (!_0x3a962b || !_0x43410c) {
      return;
    }
    _0xfdf2b9("SET_ACTIVITY", {
      pid: process.pid,
      activity: _0x503585 === null ? null : _0x1034b1(_0x503585),
    });
  }
  function _0x1a855f(_0x3cca84) {
    if (_0x3cca84 && _0x3cca84.resetTimer) {
      _0xcb697c = Math.floor(Date.now() / 1000);
    }
    _0x354275(
      _0x3cca84 || {
        details: _0x47d75a,
      },
    );
  }
  function _0x1b49a4() {
    _0x2842fb = null;
    if (!_0x3a962b || !_0x43410c) {
      return;
    }
    _0xfdf2b9("SET_ACTIVITY", {
      pid: process.pid,
      activity: null,
    });
  }
  function _0x2a48c6(_0x21fe0d) {
    if (!_0x21fe0d) {
      return;
    }
    var _0x231307 = _0x21fe0d.client_id
      ? String(_0x21fe0d.client_id)
      : _0x4ef2f3;
    if (_0x21fe0d.large_image) {
      _0x409df5 = String(_0x21fe0d.large_image);
    }
    if (_0x21fe0d.small_image) {
      _0x345245 = String(_0x21fe0d.small_image);
    }
    if (_0x21fe0d.large_text) {
      _0x3e6dcd = String(_0x21fe0d.large_text);
    }
    if (_0x21fe0d.button_label) {
      _0x3d11d9 = String(_0x21fe0d.button_label);
    }
    if (_0x21fe0d.button_url) {
      _0x8a0cc9 = String(_0x21fe0d.button_url);
    }
    if (_0x21fe0d.details_launcher) {
      _0x1accd8 = String(_0x21fe0d.details_launcher);
    }
    if (_0x21fe0d.details_menu) {
      _0x47d75a = String(_0x21fe0d.details_menu);
    }
    if (_0x21fe0d.details_playing) {
      _0x19f655 = String(_0x21fe0d.details_playing);
    }
    if (_0x21fe0d.small_text) {
      _0x3521c7 = String(_0x21fe0d.small_text);
    }
    if (_0x231307 && _0x231307 !== _0x4ef2f3) {
      _0x4ef2f3 = _0x231307;
      if (_0x43410c && _0x49e3ac !== _0x4ef2f3) {
        try {
          if (_0x1831b9) {
            _0x1831b9.destroy();
          }
        } catch (_0x2e365f) {}
        _0x43410c = false;
        _0x3a962b = false;
        _0x1831b9 = null;
        _0x5ba743(0);
      }
    }
    if (_0x2842fb) {
      _0x354275(_0x2842fb);
    }
  }
  function _0x49f3ca() {
    _0x32d7d3 = false;
    if (!_0x4ef2f3) {
      return;
    }
    _0x5ba743(0);
  }
  function _0x414831() {
    _0x32d7d3 = true;
    if (_0x5092b9) {
      clearTimeout(_0x5092b9);
      _0x5092b9 = null;
    }
    try {
      _0x1b49a4();
    } catch (_0x2e37a7) {}
    _0x3a962b = false;
    _0x43410c = false;
    if (_0x1831b9) {
      try {
        _0x1831b9.end();
      } catch (_0x1f326a) {}
      try {
        _0x1831b9.destroy();
      } catch (_0x26b425) {}
      _0x1831b9 = null;
    }
  }
  return {
    start: _0x49f3ca,
    stop: _0x414831,
    setActivity: _0x1a855f,
    clearActivity: _0x1b49a4,
    applyConfig: _0x2a48c6,
    setSmallText: function (_0x156218) {
      _0x3521c7 = String(_0x156218 || "");
      if (_0x2842fb) {
        _0x354275(_0x2842fb);
      }
    },
    setFromPresencePayload: function (_0x15ce1f) {
      _0x15ce1f = _0x15ce1f || {};
      if (_0x15ce1f.is_online === false) {
        _0x1b49a4();
        return;
      }
      if (_0x15ce1f.small_text) {
        _0x3521c7 = String(_0x15ce1f.small_text);
      }
      if (_0x15ce1f.room_name) {
        _0x1a855f({
          details: _0x15ce1f.details || _0x19f655,
          state: String(_0x15ce1f.room_name).slice(0, 128),
          smallText: _0x3521c7,
        });
        return;
      }
      _0x1a855f({
        details: _0x15ce1f.details || _0x47d75a,
        state: _0x15ce1f.state || "discord.gg/spacehax",
        smallText: _0x3521c7,
      });
    },
    detailsLauncher: function () {
      return _0x1accd8;
    },
    detailsMenu: function () {
      return _0x47d75a;
    },
    detailsPlaying: function () {
      return _0x19f655;
    },
  };
}
module.exports = {
  createDiscordPresence: createDiscordPresence,
};
