import { render, fireEvent, screen } from "@testing-library/react";
import Settings from "./Settings";

test("Test settings", async () => {
  const onChange = jest.fn();

  render(<Settings
    creativity="0.5"
    noise="0"
    size={10}
    onChange={onChange}
  />);
  fireEvent.change(screen.getByLabelText("Size"), {
    target: { value: 25 },
  });
  fireEvent.change(screen.getByLabelText("Creativity"), {
    target: { value: "0.75" },
  });
  fireEvent.change(screen.getByLabelText("Noise"), {
    target: { value: "0.15" },
  });
  fireEvent.click(screen.getByTestId("close"));
  expect(onChange).toHaveBeenCalledWith(25, "0.5", "0");
  expect(onChange).toHaveBeenCalledWith(25, "0.75", "0");
  expect(onChange).toHaveBeenCalledWith(25, "0.75", "0.15");
});
