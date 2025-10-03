export async function fetchData() {
  try {
    const response = await fetch('/data.json');
    if (!response.ok) throw new Error('Failed to fetch data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export async function getDataByKey(key) {
  const data = await fetchData();
  if (!data) return null;
  return data[key] || null;
}