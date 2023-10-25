import React from 'react';

import PageWithSidebar from 'components/PageWithSidebar';

type Props = {
  children: React.ReactNode;
};

const SidebarPage = ({ children }: Props) => {
  return <PageWithSidebar>{children}</PageWithSidebar>;
};

export default SidebarPage;
