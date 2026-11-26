import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PageCataloguePage from "@/pages/admin/PageCataloguePage.vue";
import { AI_CATALOGUE_SECTION_IDS } from "@/constants/aiCatalogue";

vi.mock("vue-router", () => ({
  RouterLink: {
    name: "RouterLink",
    props: ["to"],
    template: "<a :href=\"typeof to === 'string' ? to : '#'\"><slot /></a>",
  },
  useRoute: () => ({ hash: "" }),
  useRouter: () => ({ push: vi.fn() }),
}));

function stubDesktopViewport(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

function stubMobileViewport(): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("max-width"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("PageCataloguePage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    setActivePinia(createPinia());
    stubDesktopViewport();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function mountPage() {
    return mount(PageCataloguePage, {
      global: {
        stubs: {
          BackLink: true,
          AdminFilterDropdown: {
            name: "AdminFilterDropdown",
            template: '<div data-testid="status-filter"><slot name="chips" /></div>',
          },
        },
      },
    });
  }

  it("renders all five sections including empty plugins", async () => {
    const wrapper = mountPage();
    await flushPromises();

    for (const id of AI_CATALOGUE_SECTION_IDS) {
      expect(wrapper.find(`#${id}`).exists()).toBe(true);
    }
    expect(wrapper.text()).toContain("no plugins yet.");
    expect(wrapper.text()).toContain("agent-workflow");
    expect(wrapper.text()).toContain("gortex");
  });

  it("filters by search across sections and shows no-matches empty state", async () => {
    const wrapper = mountPage();
    await flushPromises();

    const search = wrapper.get('input[type="search"]');
    await search.setValue("gortex");
    await flushPromises();

    expect(wrapper.find("#mcp").exists()).toBe(true);
    expect(wrapper.find("#skills").exists()).toBe(false);
    expect(wrapper.text()).toContain("gortex");

    await search.setValue("zzznomatch");
    await flushPromises();
    expect(wrapper.text()).toContain("no matches.");
  });

  it("opens matching sections on narrow viewports when searching", async () => {
    stubMobileViewport();
    const wrapper = mountPage();
    await flushPromises();

    const mcp = wrapper.get("#mcp");
    expect((mcp.element as HTMLDetailsElement).open).toBe(false);

    await wrapper.get('input[type="search"]').setValue("gortex");
    await flushPromises();

    expect((wrapper.get("#mcp").element as HTMLDetailsElement).open).toBe(true);
  });
});
