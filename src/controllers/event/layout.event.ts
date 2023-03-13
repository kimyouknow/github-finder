import { $ } from '@/utils/dom';

const handleClickMainHeader = () => {
  history.pushState(null, '', '/');
};

const handleLayoutEvent = () => {
  const $header = $<HTMLElement>('#mainHeader');

  $header.addEventListener('click', handleClickMainHeader);
};

export default handleLayoutEvent;
