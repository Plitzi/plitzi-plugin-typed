import { RootElement } from '@plitzi/plitzi-sdk'; // usePlitziServiceContext
import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import TypedJS from 'typed.js';

import './Assets/index.scss';

import type { RefObject } from 'react';

export type TypedProps = {
  ref?: RefObject<HTMLElement | null>;
  className?: string;
  prefix?: string;
  separator?: string;
  words?: string[];
  suffix?: string;
  loop?: boolean;
  typeSpeed?: number;
  backSpeed?: number;
};

const Typed = ({
  ref,
  className = '',
  prefix = '',
  separator = '',
  words,
  suffix = '',
  loop = true,
  typeSpeed = 100,
  backSpeed = 100
}: TypedProps) => {
  const typedContainerRef = useRef(null);
  const typed = useRef<TypedJS | null>(null);
  // const {
  //   settings: { previewMode }
  // } = usePlitziServiceContext();

  useEffect(() => {
    if (!words?.length) {
      return;
    }

    // elRef refers to the <span> rendered below
    typed.current = new TypedJS(typedContainerRef.current, { strings: words, loop, typeSpeed, backSpeed });

    return () => {
      // Make sure to destroy Typed instance during cleanup
      // to prevent memory leaks
      typed.current?.destroy();
    };
  }, [words, loop, typeSpeed, backSpeed]);

  return (
    <RootElement ref={ref} className={classNames('plitzi-component__typed', className)}>
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
