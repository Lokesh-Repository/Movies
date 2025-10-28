import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import type { EntryFormData, Entry } from "@/lib/api"

const entrySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  type: z.enum(["MOVIE", "TV_SHOW"]).refine((val) => val !== undefined, {
    message: "Type is required",
  }),
  director: z.string().min(1, "Director is required").max(100, "Director must be less than 100 characters"),
  budget: z.string().min(1, "Budget is required"),
  location: z.string().min(1, "Location is required").max(100, "Location must be less than 100 characters"),
  duration: z.string().min(1, "Duration is required"),
  year: z.string()
    .min(1, "Year is required")
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 1900 && year <= currentYear + 5;
    }, "Year must be between 1900 and 5 years in the future"),
})

interface EntryFormProps {
  entry?: Entry
  onSubmit: (data: EntryFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function EntryForm({ entry, onSubmit, onCancel, isLoading = false }: EntryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: entry ? {
      title: entry.title,
      type: entry.type,
      director: entry.director,
      budget: entry.budget,
      location: entry.location,
      duration: entry.duration,
      year: entry.year,
    } : {
      title: "",
      type: "MOVIE",
      director: "",
      budget: "",
      location: "",
      duration: "",
      year: "",
    },
  })

  const handleFormSubmit = async (data: EntryFormData) => {
    try {
      await onSubmit(data)
      if (!entry) {
        reset() // Reset form only for new entries
      }
    } catch (error) {
      // Error handling is done by the parent component
      console.error("Form submission error:", error)
    }
  }

  const isFormLoading = isLoading || isSubmitting

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Mobile-first responsive grid */}
      <div className="space-y-6 sm:space-y-4">
        {/* Title - Full width on all screens */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium">
            Title *
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter movie or TV show title"
            disabled={isFormLoading}
            className={`h-12 text-base ${errors.title ? "border-red-500 focus:border-red-500" : ""}`}
            autoComplete="off"
          />
          {errors.title && (
            <div className="flex items-start space-x-2 mt-2">
              <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <p className="text-sm text-red-600 leading-tight">{errors.title.message}</p>
            </div>
          )}
        </div>

        {/* Type and Year - Side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-base font-medium">
              Type *
            </Label>
            <Select
              id="type"
              {...register("type")}
              disabled={isFormLoading}
              className={`h-12 text-base ${errors.type ? "border-red-500 focus:border-red-500" : ""}`}
            >
              <option value="MOVIE">🎬 Movie</option>
              <option value="TV_SHOW">📺 TV Show</option>
            </Select>
            {errors.type && (
              <div className="flex items-start space-x-2 mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <p className="text-sm text-red-600 leading-tight">{errors.type.message}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year" className="text-base font-medium">
              Year *
            </Label>
            <Input
              id="year"
              {...register("year")}
              placeholder="e.g., 2024"
              disabled={isFormLoading}
              className={`h-12 text-base ${errors.year ? "border-red-500 focus:border-red-500" : ""}`}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
            />
            {errors.year && (
              <div className="flex items-start space-x-2 mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <p className="text-sm text-red-600 leading-tight">{errors.year.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Director - Full width */}
        <div className="space-y-2">
          <Label htmlFor="director" className="text-base font-medium">
            Director *
          </Label>
          <Input
            id="director"
            {...register("director")}
            placeholder="Enter director's name"
            disabled={isFormLoading}
            className={`h-12 text-base ${errors.director ? "border-red-500 focus:border-red-500" : ""}`}
            autoComplete="name"
          />
          {errors.director && (
            <div className="flex items-start space-x-2 mt-2">
              <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <p className="text-sm text-red-600 leading-tight">{errors.director.message}</p>
            </div>
          )}
        </div>

        {/* Location - Full width */}
        <div className="space-y-2">
          <Label htmlFor="location" className="text-base font-medium">
            Filming Location *
          </Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Enter filming location or country"
            disabled={isFormLoading}
            className={`h-12 text-base ${errors.location ? "border-red-500 focus:border-red-500" : ""}`}
            autoComplete="off"
          />
          {errors.location && (
            <div className="flex items-start space-x-2 mt-2">
              <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
              <p className="text-sm text-red-600 leading-tight">{errors.location.message}</p>
            </div>
          )}
        </div>

        {/* Budget and Duration - Side by side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-base font-medium">
              Budget *
            </Label>
            <Input
              id="budget"
              {...register("budget")}
              placeholder="e.g., $50M, $100,000"
              disabled={isFormLoading}
              className={`h-12 text-base ${errors.budget ? "border-red-500 focus:border-red-500" : ""}`}
              autoComplete="off"
            />
            {errors.budget && (
              <div className="flex items-start space-x-2 mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <p className="text-sm text-red-600 leading-tight">{errors.budget.message}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-base font-medium">
              Duration *
            </Label>
            <Input
              id="duration"
              {...register("duration")}
              placeholder="e.g., 120 min, 45 min/episode"
              disabled={isFormLoading}
              className={`h-12 text-base ${errors.duration ? "border-red-500 focus:border-red-500" : ""}`}
              autoComplete="off"
            />
            {errors.duration && (
              <div className="flex items-start space-x-2 mt-2">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <p className="text-sm text-red-600 leading-tight">{errors.duration.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions - Mobile-optimized */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col space-y-3 sm:flex-row-reverse sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
          <Button
            type="submit"
            disabled={isFormLoading}
            className="h-12 text-base font-medium touch-manipulation"
          >
            {isFormLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {entry ? "Updating..." : "Creating..."}
              </>
            ) : (
              entry ? "Update Entry" : "Create Entry"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isFormLoading}
            className="h-12 text-base font-medium touch-manipulation"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  )
}