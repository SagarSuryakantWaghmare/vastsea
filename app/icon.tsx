// @ts-ignore
import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // Icon JSX
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(to right, #3B82F6, #06B6D4, #14B8A6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
        }}
      >
        VS
      </div>
    ),
    {
      ...size,
    }
  );
}
