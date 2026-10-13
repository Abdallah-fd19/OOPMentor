import { useEffect, useState } from "react";
import { type SandboxObjectState } from "../../api/sandbox";

// Speed that fills the bar and puts the car at the far right of the road.
const MAX_SPEED = 200;

// Length of one dash + gap on the road's lane line. The road "scrolls" by
// exactly this amount per animation loop, so the loop has no visible jump.
const DASH_PERIOD = 28;

interface CarObject {
    instanceName: string;
    typeName: string;
    speed: number;
}

// The sandbox sends every property value as a string (it calls ToString() on
// the C# side), so we look for a "Speed" property and parse it as a number.
function toCarObject(state: SandboxObjectState): CarObject | null {
    const speedEntry = Object.entries(state.properties)
        .find(([key]) => key.toLowerCase() === "speed");

    if (!speedEntry || speedEntry[1] === null) {
        return null;
    }

    const speed = Number(speedEntry[1]); 
    if (!Number.isFinite(speed)) {
        return null;
    }

    return { instanceName: state.instanceName, typeName: state.typeName, speed };
}

export default function CarVisualizer({ objects }: { objects: SandboxObjectState[] }) {
    const cars = objects
        .map(toCarObject)
        .filter((car): car is CarObject => car !== null);

    if (cars.length === 0) {
        return null;
    }

    return (
        <div>
            <p className="mb-2 font-mono text-xs text-steel">Visual canvas</p>
            <div className="divide-y divide-line border border-line bg-panel">
                {cars.map((car) => (
                    <CarLane key={car.instanceName} car={car} />
                ))}
            </div>
        </div>
    );
}

function CarLane({ car }: { car: CarObject }) {
    // Starts false, flips to true one frame after mounting. Because the car's
    // position and the bar width depend on it, the browser sees a change from
    // "speed 0" to the real speed and plays the CSS transition between them.
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setHasStarted(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    const shownSpeed = hasStarted ? car.speed : 0;
    const fraction = Math.min(Math.max(shownSpeed / MAX_SPEED, 0), 1);
    const carX = 16 + fraction * 280;
    const isMoving = car.speed > 0;

    // Faster car = shorter loop = road markings rush by quicker.
    const roadLoopSeconds = isMoving ? DASH_PERIOD / (car.speed * 3) : 0;

    return (
        <div className="px-4 py-3">
            <div className="mb-2 flex items-baseline justify-between font-mono text-[13px]">
                <p className="text-paper">
                    {car.instanceName}
                    <span className="text-steel"> : {car.typeName}</span>
                </p>
                <p className="text-steel">
                    <span className="text-ignition">Speed</span>: {car.speed}
                </p>
            </div>

            <svg
                viewBox="0 0 400 90"
                className="w-full"
                role="img"
                aria-label={`${car.instanceName} moving at speed ${car.speed}`}
            >
                {/* Road */}
                <rect x="0" y="52" width="400" height="36" fill="#20242E" />
                <line x1="0" y1="52" x2="400" y2="52" stroke="#2E3542" strokeWidth="1" />
                <line
                    x1="0" y1="72" x2="400" y2="72"
                    stroke="#7C8798"
                    strokeWidth="2"
                    strokeDasharray={`16 ${DASH_PERIOD - 16}`}
                    className={isMoving ? "anim-road-scroll" : undefined}
                    style={{ animationDuration: `${roadLoopSeconds}s` }}
                />

                {/* Car — this <g> slides right as the speed grows */}
                <g
                    style={{
                        transform: `translateX(${carX}px)`,
                        transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                >
                    <path
                        d="M4 44 L4 32 Q4 26 10 25 L26 23 L38 12 Q41 10 46 10 L64 10 Q69 10 72 14 L80 24 Q88 25 90 31 L90 44 Z"
                        fill="#F2A93C"
                    />
                    <path d="M41 14 L31 24 L54 24 L54 14 Z" fill="#14171C" opacity="0.75" />
                    <path d="M58 14 L58 24 L76 24 L69 15 Q68 14 66 14 Z" fill="#14171C" opacity="0.75" />
                    <rect x="86" y="30" width="4" height="4" fill="#E8E6DF" />
                    <Wheel cx={22} isMoving={isMoving} />
                    <Wheel cx={70} isMoving={isMoving} />
                </g>
            </svg>

            <div className="mt-2 h-1.5 w-full bg-ink">
                <div
                    className="h-full bg-ignition"
                    style={{
                        width: `${fraction * 100}%`,
                        transition: "width 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                />
            </div>
        </div>
    );
}

function Wheel({ cx, isMoving }: { cx: number; isMoving: boolean }) {
    // The cross-shaped spokes are what make the spin visible — a plain circle
    // looks the same at every rotation angle.
    return (
        <g className={isMoving ? "anim-wheel-spin" : undefined}>
            <circle cx={cx} cy={45} r={8} fill="#14171C" stroke="#7C8798" strokeWidth="2" />
            <line x1={cx - 5} y1={45} x2={cx + 5} y2={45} stroke="#7C8798" strokeWidth="1.5" />
            <line x1={cx} y1={40} x2={cx} y2={50} stroke="#7C8798" strokeWidth="1.5" />
        </g>
    );
}
