import * as React from 'react';
import { motion, useAnimation, Variants, transform } from 'framer-motion';
import { useAsync } from '@umijs/hooks';

const FinishCircleVariants: Variants = {
  initial: {
    pathLength: 0
  },
  show: {
    pathLength: 1
  }
};

export const FinishCircle = () => {
  const circleAnimator = useAnimation();
  const symbolAnimator = useAnimation();

  useAsync(async () => {
    circleAnimator.stop();
    symbolAnimator.stop();
    circleAnimator.set('initial');
    symbolAnimator.set('initial');
    await circleAnimator.start('show', { duration: 0.6 });
    await symbolAnimator.start('show');
  }, []);

  return (
    <svg className="progress-icon" viewBox="0 0 60 60" style={{ height: 128 }}>
      <motion.path
        fill="none"
        strokeWidth="3"
        stroke="white"
        strokeDasharray="0 1"
        d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
        style={{
          rotate: 90,
          translateX: 5,
          translateY: 5,
          scaleX: -1 // Reverse direction of line animation
        }}
        initial="initial"
        animate={circleAnimator}
        variants={FinishCircleVariants}
      />
      <motion.path
        fill="none"
        strokeWidth="5"
        stroke="white"
        d="M14,26 L 22,33 L 35,16"
        strokeDasharray="0 1"
        initial="initial"
        animate={symbolAnimator}
        variants={FinishCircleVariants}
      />
    </svg>
  );
};

const scale = 1.1;

export const marks = {
  enterScreen: 0.1,
  beginFirstPoint: 0.2,
  beginFirstScale: 0.3,
  endFirstScale: 0.4,
  endFirstPoint: 0.5,
  beginSecondPoint: 0.6,
  beginSecondScale: 0.7,
  endSecondScale: 0.8,
  endSecondPoint: 0.9,
  exitScreen: 1
};

export function mapPosX(ratio: number, width: number): number {
  const enterPosX = width / 2;
  const FirstPosX = width / 8;
  const SecondPosX = -FirstPosX;
  const exitPosX = -enterPosX;

  const {
    enterScreen,
    beginFirstPoint,
    endFirstPoint,
    beginSecondPoint,
    endSecondPoint,
    exitScreen
  } = marks;

  return ratio <= enterScreen
    ? enterPosX
    : ratio <= beginFirstPoint
    ? transform(ratio, [enterScreen, beginFirstPoint], [enterPosX, FirstPosX])
    : ratio <= endFirstPoint
    ? FirstPosX
    : ratio <= beginSecondPoint
    ? transform(ratio, [endFirstPoint, beginSecondPoint], [FirstPosX, SecondPosX])
    : ratio <= endSecondPoint
    ? SecondPosX
    : ratio <= exitScreen
    ? transform(ratio, [endSecondPoint, exitScreen], [SecondPosX, exitPosX])
    : exitPosX;
}

export function mapFirstImgScale(ratio: number) {
  const { beginFirstPoint, beginFirstScale, endFirstScale, endFirstPoint } = marks;

  return ratio <= beginFirstPoint
    ? 1
    : ratio <= beginFirstScale
    ? transform(ratio, [beginFirstPoint, beginFirstScale], [1, scale])
    : ratio <= endFirstScale
    ? scale
    : ratio <= endFirstPoint
    ? transform(ratio, [endFirstScale, endFirstPoint], [scale, 1])
    : 1;
}

export function mapSecondImgScale(ratio: number) {
  const { beginSecondPoint, beginSecondScale, endSecondScale, endSecondPoint } = marks;

  return ratio <= beginSecondPoint
    ? 1
    : ratio <= beginSecondScale
    ? transform(ratio, [beginSecondPoint, beginSecondScale], [1, scale])
    : ratio <= endSecondScale
    ? scale
    : ratio <= endSecondPoint
    ? transform(ratio, [endSecondScale, endSecondPoint], [scale, 1])
    : 1;
}
