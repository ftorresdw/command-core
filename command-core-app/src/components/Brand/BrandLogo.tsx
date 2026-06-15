import logoFull from '../../assets/command-core-logo.png'
import { CoreIcon } from './CoreIcon'
import styles from './Brand.module.css'

type BrandLogoProps = {
  variant?: 'full' | 'sidebar' | 'icon'
  className?: string
}

export function BrandLogo(props: BrandLogoProps) {
  const variant = props.variant ?? 'full'

  if (variant === 'icon') {
    return <CoreIcon className={`${styles.coreIcon} ${props.className ?? ''}`} />
  }

  return (
    <img
      src={logoFull}
      alt="Command Core"
      className={`${styles.logo} ${styles[variant]} ${props.className ?? ''}`}
    />
  )
}

export function BrandTagline() {
  return (
    <p className={styles.tagline}>
      <span className={styles.connect}>Connect.</span>{' '}
      <span className={styles.orchestrate}>Orchestrate.</span>{' '}
      <span className={styles.transform}>Transform.</span>
    </p>
  )
}
