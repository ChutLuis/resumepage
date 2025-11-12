import { motion, Variants } from 'framer-motion'
import { ComponentType } from 'react'

import styles from '../styles'

import { staggerContainer } from '../utils/motion'

const SectionWrapper = (Component: ComponentType, idName: string) =>
    function HOC() {
    return (
        <motion.section
        variants={staggerContainer() as Variants}
        initial="show"
        animate="show"
        viewport={{once: true, amount: 0.25}}
        className={`${styles.styles.padding} max-w-7xl mx-auto relative z-0`}>
            <span className='hash-span' id={idName}>
                &nbsp;
            </span>
            <Component />
        </motion.section>
    )
}

export default SectionWrapper
