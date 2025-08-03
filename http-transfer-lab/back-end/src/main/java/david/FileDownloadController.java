package david;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@CrossOrigin
public class FileDownloadController {

    // Helper to create a dummy file of a specific size in MB
    private File createDummyFile(int sizeInMb) throws IOException {
        Path tempFile = Files.createTempFile("dummy-data-" + sizeInMb + "mb-", ".bin");
        // Write sizeInMb * 1024 * 1024 bytes
        Files.write(tempFile, new byte[sizeInMb * 1024 * 1024]);
        tempFile.toFile().deleteOnExit();
        return tempFile.toFile();
    }

    @GetMapping(value = "/download-standard/{sizeInMb}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> downloadStandard(@PathVariable int sizeInMb) throws IOException {
        File file = createDummyFile(sizeInMb);
        Resource resource = new FileSystemResource(file);
        System.out.println("Serving '/download-standard' with Content-Length for " + sizeInMb + "MB file.");

        // Return the raw data stream. NO "attachment" header.
        return ResponseEntity.ok()
                .contentLength(file.length()) // Explicitly set content length
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
    }

    @GetMapping(value = "/download-stream/{sizeInMb}", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<StreamingResponseBody> downloadStream(@PathVariable int sizeInMb) throws IOException {
        System.out.println("Serving '/download-stream' with chunked encoding for " + sizeInMb + "MB file.");

        StreamingResponseBody stream = outputStream -> {
            // Send data in 1MB chunks
            int chunkSize = 1024 * 1024;
            byte[] chunk = new byte[chunkSize];
            long totalBytesToSend = (long) sizeInMb * 1024 * 1024;

            try {
                for (long i = 0; i < totalBytesToSend; i += chunkSize) {
                    Thread.sleep(50); // Simulate work/delay

                    // Write the 1MB chunk to the output stream
                    outputStream.write(chunk);
                    outputStream.flush(); // Ensure the chunk is sent immediately

                    System.out.println("Sent a 1MB chunk...");
                }
            } catch (InterruptedException e) {
                System.err.println("Thread interrupted during streaming.");
                Thread.currentThread().interrupt();
            }
            System.out.println("Streaming finished.");
        };

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(stream);
    }
}
