export function ExternalLink(props: React.ComponentProps<"a">) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noreferrer"
      className={`text-sky-400 hover:text-sky-500 ${props.className}`}
    />
  )
}
