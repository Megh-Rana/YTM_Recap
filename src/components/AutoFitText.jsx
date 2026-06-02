import { useLayoutEffect, useRef, useState } from 'react';

export default function AutoFitText({ children, maxFontSize, style, className, align = 'left', lineHeight = 1 }) {
  const measureRef = useRef(null);
  const [dims, setDims] = useState(null);

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const r = measureRef.current.getBoundingClientRect();
    setDims({ w: Math.ceil(r.width), h: Math.ceil(r.height) });
  }, [children, maxFontSize, JSON.stringify(style)]);

  return (
    <>
      <span ref={measureRef} aria-hidden style={{
        position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap',
        pointerEvents: 'none', fontSize: maxFontSize, lineHeight, ...style,
      }}>
        {children}
      </span>
      {dims && (
        <svg
          aria-label={typeof children === 'string' ? children : undefined}
          viewBox={`0 0 ${dims.w} ${dims.h}`}
          preserveAspectRatio={`${align === 'center' ? 'xMidYMid' : 'xMinYMid'} meet`}
          className={className}
          style={{ width: '100%', maxWidth: dims.w, display: 'block', overflow: 'visible' }}
        >
          <text
            x={align === 'center' ? dims.w / 2 : 0}
            y={dims.h * 0.78}
            textAnchor={align === 'center' ? 'middle' : 'start'}
            style={{ fontSize: maxFontSize, fill: 'currentColor', ...style }}
          >
            {children}
          </text>
        </svg>
      )}
    </>
  );
}
