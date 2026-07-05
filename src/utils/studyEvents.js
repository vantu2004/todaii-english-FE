// Custom events for study tracking and UI updates
export const STUDY_EVENTS = {
  PING_SUCCESS: "study:ping-success",
  ITEM_INCREMENTED: "study:item-incremented",
};

export const emitStudyEvent = (eventName) => {
  window.dispatchEvent(new CustomEvent(eventName));
};
