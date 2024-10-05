const v8 = require('v8');

// Get the heap statistics
const heapStats = v8.getHeapStatistics();

// Log the memory limit
console.log(`Total Heap Size: ${heapStats.total_heap_size / (1024 * 1024)} MB`);
console.log(`Total Heap Size Executable: ${heapStats.total_heap_size_executable / (1024 * 1024)} MB`);
console.log(`Used Heap Size: ${heapStats.used_heap_size / (1024 * 1024)} MB`);
console.log(`Heap Limit: ${heapStats.heap_size_limit / (1024 * 1024)} MB`);