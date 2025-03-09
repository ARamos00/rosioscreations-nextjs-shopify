import clsx from "clsx"; // Utility to conditionally join CSS class names

// Price component displays a formatted currency value along with a currency code.
// It uses the Intl.NumberFormat API to format the amount according to the locale.
const Price = ({
                 amount,
                 className,
                 currencyCode = "USD",
                 currencyCodeClassName,
               }: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => (
    // The paragraph element displays the formatted price.
    <p suppressHydrationWarning={true} className={className}>
      {`${new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "narrowSymbol",
      }).format(parseFloat(amount))}`}
      {/* Span for displaying the currency code with additional styling */}
      <span className={clsx("ml-1 inline", currencyCodeClassName)}>
      {`${currencyCode}`}
    </span>
    </p>
);

export default Price;
