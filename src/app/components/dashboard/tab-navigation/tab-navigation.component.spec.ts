import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TabNavigationComponent } from './tab-navigation.component';
import { TabComponent } from './tab.component';

@Component({
  imports: [TabNavigationComponent, TabComponent],
  template: `
    <app-tab-navigation [(activeIndex)]="selected">
      <app-tab title="Tab 1">
        <p>Inhalt 1</p>
      </app-tab>
      <app-tab title="Tab 2">
        <p>Inhalt 2</p>
      </app-tab>
    </app-tab-navigation>
  `
})
class TestHostComponent {
  selected = signal(0);
}

describe('TabNavigationComponent', () => {
  let component: TabNavigationComponent;
  let fixture: ComponentFixture<TabNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabNavigationComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TabNavigationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Route mode', () => {
    it('should render route links and router-outlet when tabs input is provided', async () => {
      fixture.componentRef.setInput('tabs', [
        { name: 'Route 1', route: '/path1' },
        { name: 'Route 2', route: '/path2' }
      ]);
      fixture.detectChanges();
      await fixture.whenStable();

      const links = fixture.nativeElement.querySelectorAll('nav a');
      expect(links.length).toBe(2);
      expect(links[0].textContent.trim()).toBe('Route 1');
      expect(links[1].textContent.trim()).toBe('Route 2');

      const outlet = fixture.nativeElement.querySelector('router-outlet');
      expect(outlet).toBeTruthy();
    });
  });
});

describe('TabNavigationComponent with projected TabComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();
    await hostFixture.whenStable();
  });

  it('should render tab headers from projected app-tab components and switch content', async () => {
    const buttons = hostFixture.nativeElement.querySelectorAll('nav button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('Tab 1');
    expect(buttons[1].textContent.trim()).toBe('Tab 2');

    const panels = hostFixture.nativeElement.querySelectorAll('app-tab');
    expect(panels.length).toBe(2);
    expect(panels[0].hasAttribute('hidden')).toBeFalse();
    expect(panels[1].hasAttribute('hidden')).toBeTrue();

    // Click second tab
    buttons[1].click();
    hostFixture.detectChanges();
    await hostFixture.whenStable();

    expect(panels[0].hasAttribute('hidden')).toBeTrue();
    expect(panels[1].hasAttribute('hidden')).toBeFalse();
    expect(hostComponent.selected()).toBe(1);
  });
});
