// Packages
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { RootElement } from '@plitzi/plitzi-sdk'; // usePlitziServiceContext
import TypedJS from 'typed.js';

// Styles
import './Assets/index.scss';

const emptyObject = {};
const emptyWords = [];

/**
 * @param {{
 *   ref: React.RefObject<any>;
 *   className: string;
 *   internalProps: Record<string, any>;
 *   prefix: string;
 *   separator: string;
 *   words: string[];
 *   suffix: string;
 *   loop: boolean;
 * }} props
 * @returns {React.ReactElement}
 */
const Typed = props => {
  const {
    ref,
    className = '',
    internalProps = emptyObject,
    prefix = '',
    separator = ',',
    words = emptyWords,
    suffix = '',
    loop = true
  } = props;
  const typedContainerRef = useRef(null);
  const typed = useRef(null);
  // const {
  //   settings: { previewMode }
  // } = usePlitziServiceContext();

  useEffect(() => {
    const options = {
      strings: words,
      loop,
      typeSpeed: 100,
      backSpeed: 100
    };
    // elRef refers to the <span> rendered below
    typed.current = new TypedJS(typedContainerRef.current, options);
    return () => {
      // Make sure to destroy Typed instance during cleanup
      // to prevent memory leaks
      typed.current.destroy();
    };
  }, [words, loop]);

  return (
    <RootElement ref={ref} internalProps={internalProps} className={classNames('plitzi-component__typed', className)}>
      {prefix}
      <div className="typed__container">
        <span className="font-bold" ref={typedContainerRef} />
        {separator}
      </div>
      {suffix}
    </RootElement>
  );
};

export default Typed;
