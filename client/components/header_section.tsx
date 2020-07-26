import React from 'react';

export default function HeaderSection(props: HeaderSectionProps) {
  function headerClick(name: string) {
    let relativeUrl = '';
    if (name != 'Free Survey SMS') {
      relativeUrl = name.toLowerCase();
    }
    location.assign('/' + relativeUrl);
  }

  return (
    <div className={(props.selected) ? 'header-section selected' : 'header-section'}
      onClick={() => {headerClick(props.name)}}>
      { props.name }
    </div>
  );
}

class HeaderSectionProps {
  name: string;
  selected?: boolean;

  constructor(headerSectionProps: HeaderSectionProps) {
    this.name = headerSectionProps.name;
    this.selected = headerSectionProps.selected;
  }
}
