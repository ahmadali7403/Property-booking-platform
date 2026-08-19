import { useState } from "react";

import Button from "../components/Button/Button";
import Card from "../components/Card/Card";
import Badge from "../components/Badge/Badge";
import Input from "../components/Input/Input";
import Modal from "../components/Modal/Modal";
import Drawer from "../components/Drawer/Drawer";
import Skeleton from "../components/Skeleton/Skeleton";
import Avatar from "../components/Avatar/Avatar";
import StarRating from "../components/StarRating/StarRating";
import Toast from "../components/Toast/Toast";
import Stepper from "../components/Stepper/Stepper";

const StyleGuide = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [guests, setGuests] = useState(2);

  return (
    <main className="min-h-screen bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <header>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-brand-600">
            Design System
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Property Booking Style Guide
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Reusable components and design patterns for the property booking
            platform.
          </p>
        </header>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Buttons</h2>

          <div className="flex flex-wrap gap-3">
            <Button>Primary Button</Button>

            <Button variant="secondary">Secondary Button</Button>

            <Button variant="ghost">Ghost Button</Button>

            <Button disabled>Disabled</Button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Cards</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900">Standard Card</h3>

                <p className="mt-2 text-sm text-gray-600">
                  A reusable surface for property information.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900">Hover Card</h3>

                <p className="mt-2 text-sm text-gray-600">
                  Hover over this card to see the elevation effect.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Badges</h2>

          <div className="flex flex-wrap gap-3">
            <Badge>Apartment</Badge>
            <Badge variant="brand">Guest Favorite</Badge>
            <Badge variant="success">Available</Badge>
            <Badge variant="warning">Limited Dates</Badge>
            <Badge variant="danger">Unavailable</Badge>
          </div>
        </section>

        {/* Input */}
        <section className="max-w-xl space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Inputs</h2>

          <Input
            id="style-guide-name"
            label="Your name"
            placeholder="Enter your name"
          />

          <Input
            id="style-guide-error"
            label="Email"
            placeholder="Enter your email"
            error="Please enter a valid email address."
          />
        </section>

        {/* Avatar + Rating */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Avatar & Star Rating
          </h2>

          <div className="flex flex-wrap items-center gap-6">
            <Avatar
              src="https://i.pravatar.cc/150?img=47"
              alt="Ayesha Khan"
              size="sm"
            />

            <Avatar
              src="https://i.pravatar.cc/150?img=47"
              alt="Ayesha Khan"
              size="md"
            />

            <Avatar
              src="https://i.pravatar.cc/150?img=47"
              alt="Ayesha Khan"
              size="lg"
            />

            <StarRating rating={4.8} />

            <StarRating rating={4.2} showValue={false} />
          </div>
        </section>

        {/* Skeleton */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Skeleton</h2>

          <div className="max-w-xl space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </section>

        {/* Stepper */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Guest Stepper</h2>

          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-700">Guests</span>

            <Stepper value={guests} min={1} max={10} onChange={setGuests} />
          </div>
        </section>

        {/* Modal + Drawer */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Modal & Drawer
          </h2>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

            <Button variant="secondary" onClick={() => setIsDrawerOpen(true)}>
              Open Drawer
            </Button>
          </div>
        </section>

        {/* Toast */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Toast</h2>

          <Button onClick={() => setShowToast(true)}>Show Toast</Button>
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
      >
        <p className="text-sm leading-6 text-gray-600">
          This is a reusable modal component animated with Framer Motion.
        </p>

        <div className="mt-6 flex justify-end">
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Example Drawer"
      >
        <p className="text-sm leading-6 text-gray-600">
          On mobile this drawer enters from the bottom. On desktop it appears
          from the side.
        </p>
      </Drawer>

      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        message="Your property has been added to your wishlist."
        type="success"
      />
    </main>
  );
};

export default StyleGuide;
