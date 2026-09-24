import Image, { type ImageProps } from 'next/image';

/**
 * next/image, except SVGs (tool logos, uploaded vector art) are served as-is:
 * they are already tiny and the optimiser would refuse them.
 */
export function SiteImage(props: ImageProps) {
  const src = typeof props.src === 'string' ? props.src : '';
  const isSvg = /\.svg(\?|$)/i.test(src);
  return <Image {...props} unoptimized={props.unoptimized || isSvg} />;
}
