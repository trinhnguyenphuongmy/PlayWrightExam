import { expect, Locator } from "@playwright/test";
import { AbstractPage } from "../pages/web/AbstractPage";

export class AbstractPageAssertion<T extends AbstractPage> {
  constructor(private abstractPage: T) {}

  async verifyCurrentUrlContains(expectedPath: string): Promise<void> {
    const escaped = expectedPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    await expect(this.abstractPage.getPage).toHaveURL(new RegExp(escaped));
  }
}
