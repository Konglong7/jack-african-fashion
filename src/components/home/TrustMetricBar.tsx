'use client';

export function TrustMetricBar() {
  const metrics = [
    {
      value: '20+',
      label: 'Years in African Fashion',
      subtext: 'Two decades dedicated to specialized womenswear cutting & global trade.'
    },
    {
      value: '600K+',
      label: 'Ready-to-Ship Units',
      subtext: 'High-volume Guangzhou warehouse inventory ready for immediate dispatch.'
    },
    {
      value: '5 pcs',
      label: 'Starting Wholesale MOQ',
      subtext: 'Flexible trial orders for boutique owners, retail stores & emerging brands.'
    },
    {
      value: '48h',
      label: 'Fast Cargo Handover',
      subtext: 'Rapid dispatch to air and sea freight forwarders across Guangzhou.'
    }
  ];

  return (
    <section
      aria-label='Key Manufacturing & Supply Metrics'
      className='border-y border-[#171615]/10 bg-[#EEE5DA]/60 py-8 sm:py-10'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8'>
          {metrics.map((item, idx) => (
            <div
              key={idx}
              className='relative flex flex-col justify-between rounded-[20px] border border-[#171615]/8 bg-[#F7F2EB] p-5 shadow-xs transition-transform duration-200 hover:-translate-y-1 sm:p-6'
            >
              <div className='mb-2 flex items-baseline gap-1'>
                <span className='font-display text-3xl font-extrabold tracking-tight text-[#171615] sm:text-4xl lg:text-5xl'>
                  {item.value}
                </span>
                <span className='h-2 w-2 rounded-full bg-[#E2AB2F]' aria-hidden='true' />
              </div>
              <div>
                <h3 className='text-xs font-bold uppercase tracking-wider text-[#B17C0E] sm:text-sm'>
                  {item.label}
                </h3>
                <p className='mt-1 text-[11px] leading-relaxed text-[#6F6A64] sm:text-xs'>
                  {item.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
