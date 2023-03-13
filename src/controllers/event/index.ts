import handleLayoutEvent from '@/controllers/event/layout.event';
import handleSearchForm from '@/controllers/event/searchForm.event';

const addEventHandler = () => {
  handleSearchForm();
  handleLayoutEvent();
};

export default addEventHandler;
