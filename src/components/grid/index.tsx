import clsx from "clsx";

// Grid component renders an unordered list with grid layout styles.
// It passes along any additional props and children.
export default function Grid(props: React.ComponentProps<"ul">) {
  return (
      <ul
          {...props}
          className={clsx("grid grid-flow-row gap-4", props.className)}
      >
        {props.children}
      </ul>
  );
}

// GridItem component renders a list item with a square aspect ratio and opacity transition.
// It passes along any additional props and children.
function GridItem(props: React.ComponentProps<"li">) {
  return (
      <li
          {...props}
          className={clsx("aspect-square transition-opacity", props.className)}
      >
        {props.children}
      </li>
  );
}

// Attach GridItem as a subcomponent of Grid for organized usage.
Grid.Item = GridItem;
