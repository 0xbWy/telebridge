import { memo } from '../../lib/teact/teact';

import useLang from '../../hooks/useLang';

import styles from './GlitchLogo.module.scss';

interface OwnProps {
  className?: string;
}

const GlitchLogo = ({ className }: OwnProps) => {
  const lang = useLang();

  return (
    <div className={`${styles.container}${className ? ` ${className}` : ''}`}>
      <span className={styles.glitchText} data-text={lang('Telegram')}>
        {lang('Telegram')}
      </span>
    </div>
  );
};

export default memo(GlitchLogo);
