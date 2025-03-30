import si from 'systeminformation';

export default defineEventHandler(async () => {
  try {
    const [cpu, mem, disk, speed] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.cpu()
    ]);

    return {
      success: true,
      data: {
        cpu: {
          usage: cpu.currentLoad,
          cores: cpu.cpus?.map(core => core.load) || [],
          speed: speed.speed
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          swapUsed: mem.swapused,
          swapTotal: mem.swaptotal
        },
        disks: disk.map(d => ({
          fs: d.fs,
          size: d.size,
          used: d.used,
          use: d.use,
          mount: d.mount
        }))
      }
    };
  } catch (err: any) {
    console.error('Erreur monitoring:', err);
    return {
      success: false,
      error: err.message
    };
  }
}); 