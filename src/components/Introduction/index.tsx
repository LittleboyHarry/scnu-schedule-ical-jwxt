import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { useInViewport, useResponsive, useSize } from '@umijs/hooks';
import { useScrollPercentage } from 'react-scroll-percentage';
import { getAppState } from '../../AppState';
import { motion, transform } from 'framer-motion';

import { mapFirstImgScale, mapPosX, mapSecondImgScale, marks } from './movie-clip';
import { IntroductionImageSources } from './assets';

import './index.scss';

const Section = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<{
    className?: string;
    style?: CSSProperties;
  }>
>(({ children, style, className }, ref) => {
  return (
    <section
      {...{ ref }}
      className={classnames('intro-section', className)}
      {...{ children, style }}
    />
  );
});

function screenshotProps(id: number) {
  return {
    className: 'intro-display-img',
    alt: '展示效果',
    src: IntroductionImageSources[id - 1]
  };
}
export default function Introduction() {
  const biggerThanMd = useResponsive().md;
  const [onSecondPage, secondPageRef] = useInViewport<HTMLDivElement>();
  const [thirdPageRef, _thirdPageRatio] = useScrollPercentage();
  const thirdPageRatio =
    transform(
      _thirdPageRatio,
      [0, 0.05, 0.45, 0.5, 0.7, 1],
      [0, marks.enterScreen, marks.beginFirstScale, marks.beginSecondScale, marks.endSecondScale, 1]
    ) ?? 0;
  const [{ width }] = useSize(() => document.querySelector('body')!);

  const firstImgX = mapPosX(thirdPageRatio, width ?? 1);
  const firstImgScale = mapFirstImgScale(thirdPageRatio);
  const secondImgX = mapPosX(thirdPageRatio, width ?? 1) + 64;
  const secondImgScale = mapSecondImgScale(thirdPageRatio);

  return (
    <div ref={(_) => getAppState().setIntroductionElement(_)}>
      <Section>
        <motion.div
          style={{ margin: '3rem 0 4rem' }}
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h1>绿色、简洁的校园日历</h1>
          <p>无需下载第三方APP、无流氓推广、没有多余的社交功能、耗电量极低，没有任何副作用</p>
        </motion.div>
        <div>
          <motion.div
            initial={{ y: 128, opacity: 0, scale: 0.9 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.8,
                delay: 1.6
              }
            }}
          >
            <img
              // whileHover={{ scale: 1.1, transition: { delay: 0.6 } }}
              style={{
                maxWidth: '90%',
                maxHeight: 420,
                boxShadow: '0px 16px 32px 4px #9E9E9E',
                borderRadius: 8,
                marginBottom: '2rem'
              }}
              {...screenshotProps(1)}
            />
          </motion.div>
        </div>
      </Section>
      <Section style={{ background: '#09f', color: 'white', padding: '3rem' }}>
        <h1 style={{ color: 'white' }}>跨平台的云课表</h1>
        <p style={{ paddingBottom: '2rem' }}>手机与电脑云端同步。随时随地在手机上查看我的课程！</p>
        <div ref={secondPageRef}>
          {biggerThanMd ? (
            <>
              <motion.img
                animate={{
                  x: onSecondPage ? 0 : -512
                }}
                transition={{ duration: 0.6 }}
                initial={{ originX: 0 }}
                whileHover={{ scale: 1.1 }}
                style={{
                  border: '1px solid #bbb',
                  outline: '2px solid white',
                  ...(biggerThanMd ? { marginRight: '1rem' } : { display: 'block' })
                }}
                {...screenshotProps(3)}
              />
              <motion.img
                animate={{
                  x: onSecondPage ? 0 : 512
                }}
                transition={{ duration: 0.6 }}
                initial={{ originX: 1 }}
                whileHover={{ scale: 1.1 }}
                style={{
                  border: '1px solid #bbb',
                  outline: '2px solid white',
                  ...(biggerThanMd ? { marginLeft: '1rem' } : { display: 'block' })
                }}
                {...screenshotProps(2)}
              />
            </>
          ) : (
            <>
              <img
                style={{
                  marginTop: '2rem',
                  border: '2px solid white',
                  maxWidth: '80%'
                }}
                {...screenshotProps(3)}
              />
              <img
                style={{
                  marginTop: '2rem',
                  border: '2px solid white',
                  maxHeight: '61.8vh'
                }}
                {...screenshotProps(2)}
              />
            </>
          )}
        </div>
      </Section>
      <Section style={{ padding: '3rem' }}>
        <h1>还有……</h1>
        <p>
          {/* cspell:words Siri Cortana */}
          将课表导入日历以后，Siri, Cortana 这些智能助理也能派上用场啦！更多惊喜，待您发现
          <span role="img" aria-label="开心">
            😋
          </span>
        </p>
        <div ref={thirdPageRef} style={{ paddingTop: '1rem' }}>
          <motion.img
            initial={{ originY: 1 }}
            animate={{
              x: biggerThanMd ? firstImgX : 0,
              y: 128 * thirdPageRatio,
              scale: firstImgScale,
              opacity: transform(thirdPageRatio, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
            }}
            style={{
              ...(biggerThanMd ? { marginRight: '1rem' } : { margin: '0 auto', display: 'block' }),
              maxHeight: '61.8vh'
            }}
            transition={{ duration: 0.2 }}
            {...screenshotProps(7)}
          />
          <motion.img
            animate={{
              x: biggerThanMd ? secondImgX : 0,
              y: 128 * thirdPageRatio,
              scale: secondImgScale,
              opacity: transform(thirdPageRatio, [0, 0.2, 0.9, 1], [0, 1, 1, 0])
            }}
            style={{
              ...(biggerThanMd
                ? { marginLeft: '1rem' }
                : { margin: '4rem auto', display: 'block' }),
              maxHeight: '61.8vh'
            }}
            {...screenshotProps(6)}
          />
        </div>
      </Section>
      <div style={{ height: '8rem', paddingTop: '2rem', textAlign: 'center' }}>
        <h1>开始尝试 ↓</h1>
      </div>
    </div>
  );
}
