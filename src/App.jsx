import { useEffect, useId, useState } from "react";

const APK_URL =
  "https://github.com/Ikennot04/water-irrigation-Website/releases/download/initial/SmartIrrigation.apk";

const VALVE_SETTINGS = [
  {
    name: "Off",
    open: 0,
    detail: "All three solenoid valves stay closed.",
  },
  {
    name: "Low",
    open: 1,
    detail: "Valve 1 opens. One path through the manifold.",
  },
  {
    name: "Mid",
    open: 2,
    detail: "Valves 1 and 2 open.",
  },
  {
    name: "High",
    open: 3,
    detail: "Valves 1, 2, and 3 open. This is the largest discharge.",
  },
];

const SOIL_ROWS = [
  ["0% to 20%", "Severely dry", "High"],
  ["21% to 40%", "Moderately dry", "Mid"],
  ["41% to 60%", "Slightly dry", "Low"],
  ["61% to 100%", "Sufficiently moist", "Off"],
];

const HARDWARE = [
  ["Controller", "ESP32-WROOM-32, Manual and Auto logic"],
  ["Switching", "4-channel 12V relay module"],
  ["Valves", "Three 12V DC normally-closed solenoid valves"],
  ["Flow", "YF-S201 hall-effect flow meter"],
  ["Pressure", "Sensor rated 0 to 1.2 MPa"],
  ["Soil", "Capacitive moisture sensor, 0 to 100%"],
  ["Link", "Wi-Fi access point, plus Bluetooth Low Energy"],
  ["Power", "12V DC, with a solar panel and battery"],
];

function Valves({ open }) {
  return (
    <span className="valves" aria-hidden="true">
      {[1, 2, 3].map((index) => (
        <span key={index} className={index <= open ? "valve open" : "valve"}>
          <span className="valve-body" />
        </span>
      ))}
    </span>
  );
}

function DownloadPanel() {
  return (
    <div className="download-panel">
      <p className="status-line">
        The Android package is SmartIrrigation.apk, from the project release.
      </p>
      <a className="button button-solid" href={APK_URL}>
        Download SmartIrrigation.apk
      </a>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light",
  );
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#main" onClick={closeMenu}>
          <span className="wordmark-name">Smart Irrigation</span>
          <span className="wordmark-place">Kalubihan, Tabogon</span>
        </a>
        <button
          type="button"
          className="menu-button"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
        <nav id={menuId} className={menuOpen ? "site-nav open" : "site-nav"}>
          <a href="#system" onClick={closeMenu}>
            The pipes
          </a>
          <a href="#phone" onClick={closeMenu}>
            The phone
          </a>
          <a href="#download" onClick={closeMenu}>
            Download
          </a>
          <a href="#study" onClick={closeMenu}>
            The study
          </a>
          <button type="button" className="theme-button" onClick={toggleTheme}>
            {theme === "dark" ? "Day view" : "Night view"}
          </button>
        </nav>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="place-line">
              Kalubihan, Canao-Canao, Tabogon, Cebu
            </p>
            <h1>The irrigation app for the farms in Kalubihan</h1>
            <p className="lede">
              The phone talks to an ESP32 on the perforated-pipe line. You set
              the flow to off, low, mid, or high, or you let soil moisture pick
              the setting. The controller opens its own Wi-Fi, and it also
              pairs over Bluetooth, so the phone does not need mobile data.
            </p>
            <div className="hero-actions">
              <a className="button button-solid" href={APK_URL}>
                Download the Android app
              </a>
              <a className="button button-line" href="#system">
                See how the valves are set
              </a>
            </div>
          </div>
          <figure className="hero-figure">
            <img
              src="/app-screens.jpg"
              alt="Ten screens of the Smart Irrigation app: home, control, valves, water data, history, schedule, alerts, the ESP32 connection, settings, and the Kalubihan profile."
            />
            <figcaption>
              App layout for this system. The readings drawn on the screens are
              sample figures, not measurements from the farms.
            </figcaption>
          </figure>
        </section>

        <hr className="pipe-rule" />

        <section id="system" className="band" aria-labelledby="system-title">
          <div className="band-intro">
            <h2 id="system-title">Four settings, three valves</h2>
            <p>
              Water leaves an existing tank into a main line, then into the
              perforated laterals. Flow is set by how many 12V normally-closed
              solenoid valves are open. The proposal spaces the holes at 30 cm
              so discharge stays more even as pressure falls along the lateral.
            </p>
          </div>
          <ol className="setting-list">
            {VALVE_SETTINGS.map((setting) => (
              <li key={setting.name} data-open={setting.open}>
                <div className="setting-head">
                  <h3>{setting.name}</h3>
                  <Valves open={setting.open} />
                </div>
                <p>{setting.detail}</p>
              </li>
            ))}
          </ol>

          <div className="soil-block">
            <h3>Auto mode follows soil moisture</h3>
            <p>
              In Auto, the capacitive sensor chooses the same four settings.
              Manual still lets you pick Off, Low, Mid, or High, and type a
              target volume in liters.
            </p>
            <div className="table-scroll">
              <table>
                <caption>Soil moisture and the flow Auto selects</caption>
                <thead>
                  <tr>
                    <th scope="col">Soil moisture</th>
                    <th scope="col">Condition</th>
                    <th scope="col">Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {SOIL_ROWS.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell) => (
                        <td key={cell}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <dl className="spec-list">
            {HARDWARE.map(([term, detail]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{detail}</dd>
              </div>
            ))}
          </dl>
        </section>

        <hr className="pipe-rule" />

        <section id="phone" className="band phone-band" aria-labelledby="phone-title">
          <div>
            <h2 id="phone-title">What the phone is for</h2>
            <p>
              The home screen shows system status, flow rate, pressure, soil
              moisture, water used, the current mode, runtime, and an emergency
              stop. From there the app opens the rest of the work.
            </p>
          </div>
          <ul className="duty-list">
            <li>
              <strong>Control.</strong> Manual or Automatic. Start irrigation,
              watch the volume against the target, and stop it.
            </li>
            <li>
              <strong>Valves.</strong> See which of V1, V2, and V3 are open.
            </li>
            <li>
              <strong>Records.</strong> A consumption view, a history list, and
              export of that history as CSV or Excel.
            </li>
            <li>
              <strong>Schedule.</strong> Named irrigations with a time, a
              volume, and a flow setting. Each one can be turned off.
            </li>
            <li>
              <strong>Alerts.</strong> High pressure, low soil moisture, a
              finished target, and a lost connection to the ESP32.
            </li>
            <li>
              <strong>Connection.</strong> The layout shows the controller as
              ESP32-WROOM-32, on its Wi-Fi access point at 192.168.4.1, with
              Bluetooth Low Energy as the other link.
            </li>
          </ul>
        </section>

        <hr className="pipe-rule" />

        <section id="download" className="band download-band" aria-labelledby="download-title">
          <h2 id="download-title">Install it on Android</h2>
          <DownloadPanel />
          <div className="install-grid">
            <div>
              <h3>On the phone</h3>
              <ol>
                <li>Tap Download SmartIrrigation.apk on this page.</li>
                <li>
                  Open the file. If Android asks, allow installation from that
                  browser.
                </li>
                <li>
                  In the app, join the controller&apos;s Wi-Fi access point, or
                  pair Bluetooth Low Energy.
                </li>
              </ol>
            </div>
            <div lang="ceb">
              <h3>Para sa mag-uuma</h3>
              <ol>
                <li>Pindota ang Download SmartIrrigation.apk niini nga page.</li>
                <li>
                  Ablihi ang file. Kung mangutana ang phone, tugoti ang
                  pag-install gikan sa browser.
                </li>
                <li>
                  Sa app, sumpay sa Wi-Fi access point sa ESP32, o i-pair ang
                  Bluetooth. Dili kinahanglan ang mobile data.
                </li>
              </ol>
            </div>
          </div>
        </section>

        <hr className="pipe-rule" />

        <section id="study" className="band study-band" aria-labelledby="study-title">
          <div className="study-copy">
            <h2 id="study-title">The study behind the app</h2>
            <p>
              This is the Android side of a CE Project 1 proposal at the
              University of Cebu, Main Campus: Development and Validation of an
              App-Controlled Hydraulic Flow Regulation System for
              Perforated-Pipe Irrigation in Kalubihan, Canao-Canao, Tabogon,
              Cebu. The course is Bachelor of Science in Civil Engineering,
              first semester, school year 2026-2027.
            </p>
            <p>
              The farms sit on hills and slopes, about 139 meters above sea
              level, and vegetable growing is one of the main incomes.
              Irrigation there still depends on rain that does not keep a
              schedule, and on opening the perforated-pipe flow by hand.
            </p>
            <p>
              The proposal will test a scaled prototype against the orifice and
              Darcy-Weisbach equations. The targets written in the proposal are
              flow accuracy above 95 percent and a Christiansen uniformity
              coefficient of at least 80 percent, plus valve response time from
              the app. Fifty farmers are planned for a survey on functionality,
              usability, reliability, and efficiency. Those figures are targets.
              This page does not report measured results.
            </p>
            <p className="byline">
              Niño D. Aying, Kert Ian B. Gabutan, Joanna Sky Marie C. Pino, and
              Alyza Claire I. Pinote. College of Engineering, University of
              Cebu, Main Campus, Cebu City.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          Smart Irrigation for Kalubihan, Canao-Canao, Tabogon, Cebu. University
          of Cebu, Main Campus.
        </p>
        <p>
          <a href="#download">Download</a>
          <a href="#study">The study</a>
        </p>
      </footer>
    </>
  );
}
