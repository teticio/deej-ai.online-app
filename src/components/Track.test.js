import { render, screen, waitFor } from "@testing-library/react";
import Track from "./Track";

jest.setTimeout(20000);

test("Test track widget", async () => {
  render(<Track track_id="3KZMPnlyKTDV4W7oNs7Vbk" testing={true} />);
  const widget = await waitFor(() => screen.getByTitle("3KZMPnlyKTDV4W7oNs7Vbk"), { timeout: 20000 });
  const strippedWidget = widget.srcdoc.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  console.log(strippedWidget);
  expect(strippedWidget).toMatchSnapshot();
});
