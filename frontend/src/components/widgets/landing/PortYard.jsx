// Landing hero: a container terminal. Each provider is a container in the
// yard; the gantry crane lifts one onto the ship, which stands for the single
// endpoint your app calls.
const STACKS = [
  { x: 24, boxes: [["OpenAI", "#2F6E93"], ["Stripe", "#C4511F"], ["Slack", "#E2A92B"]] },
  { x: 132, boxes: [["GitHub", "#2F7A55"], ["Discord", "#7C8287"]] },
  { x: 240, boxes: [["Google", "#A83A2C"], ["Custom", "#2F6E93"]] },
];

const BOX_W = 100;
const BOX_H = 40;
const GROUND = 330;

function Container({ x, y, label, color }) {
  const ribs = Array.from({ length: 11 }, (_, i) => x + 6 + i * 8.8);
  return (
    <g>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} fill={color} />
      {ribs.map((rx) => (
        <line key={rx} x1={rx} y1={y + 4} x2={rx} y2={y + BOX_H - 4} stroke="rgba(0,0,0,.18)" strokeWidth="1.2" />
      ))}
      <rect x={x} y={y} width={BOX_W} height={BOX_H} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
      <text
        x={x + BOX_W / 2}
        y={y + BOX_H / 2 + 5}
        textAnchor="middle"
        fontFamily="'Saira Stencil One', 'Saira Condensed', sans-serif"
        fontSize="15"
        fill="rgba(255,255,255,.92)"
      >
        {label}
      </text>
    </g>
  );
}

export default function PortYard() {
  return (
    <figure className="port-yard relative m-0" aria-label="Provider containers being loaded onto one ship">
      <svg viewBox="0 0 560 420" className="h-auto w-full" role="img">
        <title>Nexora loads every provider onto one endpoint</title>
        {/* water */}
        <rect x="360" y={GROUND} width="200" height={420 - GROUND} fill="#2F4A57" />
        <path d={`M360 ${GROUND + 22} q 12 -6 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0 t 24 0`} fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="1.5" />
        {/* quay */}
        <rect x="0" y={GROUND} width="360" height={420 - GROUND} fill="#D3CFC4" />
        <line x1="0" y1={GROUND} x2="360" y2={GROUND} stroke="#16191B" strokeWidth="2" />
        {[40, 120, 200, 280].map((bx) => (
          <rect key={bx} x={bx} y={GROUND + 8} width="36" height="6" fill="#E2A92B" />
        ))}

        {/* yard stacks */}
        {STACKS.map((s) =>
          s.boxes.map(([label, color], i) => (
            <Container key={label} x={s.x} y={GROUND - (i + 1) * BOX_H} label={label} color={color} />
          ))
        )}

        {/* ship */}
        <path d={`M378 ${GROUND - 6} L552 ${GROUND - 6} L536 ${GROUND + 40} L392 ${GROUND + 40} Z`} fill="#1F2A2E" />
        <rect x="378" y={GROUND - 12} width="174" height="6" fill="#C4511F" />
        <text x="465" y={GROUND + 24} textAnchor="middle" fontFamily="'Saira Stencil One', sans-serif" fontSize="14" fill="#F1F0EB">
          YOUR APP
        </text>
        <Container x={414} y={GROUND - 12 - BOX_H} label="OpenAI" color="#2F6E93" />

        {/* gantry crane */}
        <g stroke="#16191B" strokeWidth="5" fill="none" strokeLinecap="square">
          <line x1="300" y1={GROUND} x2="300" y2="60" />
          <line x1="350" y1={GROUND} x2="350" y2="60" />
          <line x1="300" y1="210" x2="350" y2="160" strokeWidth="3" />
        </g>
        <rect x="150" y="48" width="400" height="14" fill="#E2A92B" stroke="#16191B" strokeWidth="2" />
        <rect x="292" y="34" width="66" height="16" fill="#16191B" />

        {/* trolley + spreader carrying a container between yard and ship */}
        <g className="port-trolley">
          <rect x="-16" y="62" width="32" height="10" fill="#16191B" />
          <line x1="-10" y1="72" x2="-10" y2="128" stroke="#16191B" strokeWidth="1.5" />
          <line x1="10" y1="72" x2="10" y2="128" stroke="#16191B" strokeWidth="1.5" />
          <rect x="-54" y="128" width="108" height="6" fill="#16191B" />
          <Container x={-50} y={134} label="Stripe" color="#C4511F" />
        </g>

        {/* manifest tag */}
        <g transform="translate(30 70)">
          <rect width="150" height="64" fill="#FBFAF6" stroke="#16191B" strokeWidth="1.5" />
          <text x="12" y="22" fontFamily="'Saira Condensed', sans-serif" fontSize="13" fontWeight="600" fill="#474B4F">Manifest</text>
          <text x="12" y="48" fontFamily="'Saira Condensed', sans-serif" fontSize="22" fontWeight="700" fill="#16191B">40+ providers</text>
        </g>
      </svg>
    </figure>
  );
}
