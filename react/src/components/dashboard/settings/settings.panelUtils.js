export function checkUndef(item) {
  return (typeof item !== 'undefined');
}

export function toggleSection(sectionId, activeSections, singleOpen) {
  let present = null;
  let newActiveSections = activeSections;

  newActiveSections.map((section) => {
    if (section === sectionId) {
      present = true;
    }

    return true;
  });

  if (!singleOpen) {
    if (present) {
      const pos = newActiveSections.indexOf(sectionId);

      newActiveSections.splice(pos, 1);
    } else {
      newActiveSections.push(sectionId);
    }
  } else {
    newActiveSections = [sectionId];
  }

  return newActiveSections;
}

export function setupAccordion(info) {
  const singleOpen = (checkUndef(info.singleOpen)) ? info.singleOpen : false;
  const activeSections = [];
  const singleChild = typeof info.kids.length === 'undefined';

  if (!singleChild) {
    info.kids.forEach((child, i) => {
      const { openByDefault } = child ? child.props : false;

      if (singleOpen &&
          activeSections.length === 0 &&
          openByDefault) {
        activeSections.push(`panel-sec-${i}`);
      }
      if (!singleOpen &&
          openByDefault) {
        activeSections.push(`panel-sec-${i}`);
      }
    });
  }

  return {
    activeSections,
  };
}