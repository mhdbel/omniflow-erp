import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define strict schemas for each vertical
const pharmacySchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.literal('pharmacy'),
  metadata: z.object({
    batch: z.string(),
    expiry: z.string(), // ISO date string
    requiresRx: z.boolean(),
  })
});

const rentalSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.literal('rental'),
  metadata: z.object({
    vin: z.string().length(17),
    class: z.enum(['Economy', 'SUV', 'Luxury']),
    mileage: z.number().min(0),
  })
});

type FormData = z.infer<typeof pharmacySchema | typeof rentalSchema>;

export const ItemForm = ({ category }: { category: 'pharmacy' | 'rental' }) => {
  // Dynamically select the schema based on the category prop
  const schema = category === 'pharmacy' ? pharmacySchema : rentalSchema;
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category, metadata: {} } as any
  });

  const onSubmit = (data: FormData) => {
    console.log("Submitting to FastAPI:", data);
    // api.post('/api/v1/items', data)
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">New {category === 'pharmacy' ? 'Medication' : 'Vehicle'}</h2>
      
      <input {...form.register('sku')} placeholder="SKU" className="border p-2 w-full rounded" />
      <input {...form.register('name')} placeholder="Name" className="border p-2 w-full rounded" />

      {/* Dynamic Fields based on Category */}
      {category === 'pharmacy' && (
        <>
          <input {...form.register('metadata.batch')} placeholder="Batch Number" className="border p-2 w-full rounded" />
          <input type="date" {...form.register('metadata.expiry')} className="border p-2 w-full rounded" />
          <label className="flex items-center gap-2">
            <input type="checkbox" {...form.register('metadata.requiresRx')} />
            Requires Prescription
          </label>
        </>
      )}

      {category === 'rental' && (
        <>
          <input {...form.register('metadata.vin')} placeholder="VIN (17 chars)" maxLength={17} className="border p-2 w-full rounded" />
          <select {...form.register('metadata.class')} className="border p-2 w-full rounded">
            <option value="Economy">Economy</option>
            <option value="SUV">SUV</option>
            <option value="Luxury">Luxury</option>
          </select>
          <input type="number" {...form.register('metadata.mileage', { valueAsNumber: true })} placeholder="Mileage" className="border p-2 w-full rounded" />
        </>
      )}

      <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full font-semibold">
        Save Item
      </button>
    </form>
  );
};