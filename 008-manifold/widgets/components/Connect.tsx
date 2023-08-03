// simple connect button
export default function Connect({ network }: any) {
  return (
    <div
      data-widget="m-connect"
      data-delay-auth="true"
      data-network={network}
    ></div>
  );
}
