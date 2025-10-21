// Gemini API integration for AI assistant

export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function askGemini(
  question: string,
  context: string,
  apiKey?: string
): Promise<string> {
  try {
    const key = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!key) {
      return "⚠️ Gemini API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.";
    }

    const prompt = `You are a helpful robotics expert assistant. Use the following context from our documentation to answer the user's question. If the context doesn't contain relevant information, use your general knowledge about robotics.

Context from documentation:
${context}

User question: ${question}

Please provide a clear, concise answer. Include code examples if relevant.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      console.error('Status:', response.status, response.statusText);
      
      // Check for specific error types
      if (response.status === 400) {
        return `Error: Invalid request to Gemini API. Please check your API key and request format.`;
      } else if (response.status === 403) {
        return `Error: API key is invalid or doesn't have permission to use Gemini API.`;
      } else if (response.status === 429) {
        return `Error: Rate limit exceeded. Please try again in a moment.`;
      }
      
      return `Error: Failed to get response from Gemini API. ${response.statusText}`;
    }

    const data = await response.json();
    
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!answer) {
      return "Sorry, I couldn't generate a response. Please try again.";
    }

    return answer;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
  }
}

export async function searchDocumentation(query: string): Promise<string> {
  try {
    // In a real implementation, this would search through your MDX files
    // For now, we'll return a simple context string
    // You can enhance this by actually reading and searching your content files
    
    const topics: Record<string, string> = {
      motor: "Motors convert electrical energy to mechanical motion. Common types include brushed DC motors, brushless motors (BLDC), and servo motors. Key specs: voltage, current, RPM, torque.",
      battery: "Batteries store electrical energy. LiPo batteries are popular for robotics due to high energy density. Key specs: voltage (S count), capacity (mAh), C-rating for discharge rate.",
      sensor: "Sensors enable robots to perceive their environment. Types include ultrasonic (distance), IMU (orientation), LiDAR (mapping), cameras (vision).",
      navigation: "Navigation involves localization, mapping (SLAM), path planning (A*, Dijkstra), and obstacle avoidance. Common sensors: LiDAR, GPS, encoders, IMU.",
      pid: "PID (Proportional-Integral-Derivative) control is used for precise control. Tune Kp for responsiveness, Ki for steady-state error, Kd for damping.",
      arduino: "Arduino is a popular microcontroller platform. Arduino Uno (ATmega328P) is good for beginners. ESP32 adds WiFi/Bluetooth. Program in C/C++.",
      combat: "Combat robots require robust chassis, powerful motors, and weapon systems. Weight classes range from 1lb antweights to 250lb heavyweights. Use hardened materials like AR500 steel.",
    };

    const lowerQuery = query.toLowerCase();
    let context = "";

    for (const [topic, info] of Object.entries(topics)) {
      if (lowerQuery.includes(topic)) {
        context += info + "\n\n";
      }
    }

    if (!context) {
      context = "General robotics documentation covering motors, batteries, sensors, microcontrollers, navigation, AI, combat robots, and industrial automation.";
    }

    return context;
  } catch (error) {
    console.error('Error searching documentation:', error);
    return "";
  }
}
