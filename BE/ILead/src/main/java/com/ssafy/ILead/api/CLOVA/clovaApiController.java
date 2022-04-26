package com.ssafy.ILead.api.CLOVA;

import com.ssafy.ILead.util.S3Uploader;
import com.ssafy.ILead.api.dto.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
public class clovaApiController {

    String clientId = "n9ld7s5dom";
    String clientSecret = "ZjNf8AbNlAB9Mir0l8G0ZcNU7g8wk0OGqbg4IWeu";
    private final S3Uploader s3Uploader;

    @PostMapping("clova/stt")
    public Result speechToText(@RequestBody MultipartFile recordFile){

        MultipartFile file = null;
        try{
            file = recordFile;
            log.debug("원래 파일 이름: "+ file.getOriginalFilename());

            // 파일명
            String originFile = file.getOriginalFilename();

            // 확장자
            String originFileExtension = originFile.substring(originFile.lastIndexOf("."));

            // 저장 파일명
            // UUID클래스 - 특수문자를 포함한 문자를 랜덤으로 생성함.
            // "-"부분만 지워주고 마지막에 확장자 포함
            String storedFileName = UUID.randomUUID().toString().replaceAll("-", "") + originFileExtension;

            // 확장자 체크
            String fileType = getFileType(file);

            // file type이 지원하지 않는 경우
            if(fileType == null) {
                return new Result(HttpStatus.FORBIDDEN.value());
            }

            // clova
            String imgFile = s3Uploader.upload(file, storedFileName);
            File voiceFile = new File(imgFile);

            String language = "Kor";        // 언어 코드 ( Kor, Jpn, Eng, Chn )
            String apiURL = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=" + language;
            URL url = new URL(apiURL);

            HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            conn.setUseCaches(false);
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestProperty("Content-Type", "application/octet-stream");
            conn.setRequestProperty("X-NCP-APIGW-API-KEY-ID", clientId);
            conn.setRequestProperty("X-NCP-APIGW-API-KEY", clientSecret);

            OutputStream outputStream = conn.getOutputStream();
            FileInputStream inputStream = new FileInputStream(voiceFile);
            byte[] buffer = new byte[4096];
            int bytesRead = -1;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            outputStream.flush();
            inputStream.close();
            BufferedReader br = null;
            int responseCode = conn.getResponseCode();
            if(responseCode == 200) { // 정상 호출
                br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {  // 오류 발생
                System.out.println("error!!!!!!! responseCode= " + responseCode);
                br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            }
            String inputLine;

            if(br != null) {
                StringBuffer response = new StringBuffer();
                while ((inputLine = br.readLine()) != null) {
                    response.append(inputLine);
                }
                br.close();
                System.out.println(response.toString());
            } else {
                System.out.println("error !!!");
            }


        } catch (Exception e) {// 저장 위치 찾지 못하는 경우 92line에서 오류 발생, 417에러 return함.
            e.printStackTrace();
            return new Result(HttpStatus.EXPECTATION_FAILED.value(), e);
        }


        return new Result(HttpStatus.OK.value());
    }

    public void makeDir(String filePath) {
        if (!new File(filePath).exists()) {
            try {
                new File(filePath).mkdir();
            } catch (Exception e) {
                e.getStackTrace();
            }
        }
    }

    public String getFileType(MultipartFile files){
        String fileName = files.getOriginalFilename();
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);

        extension = extension.toLowerCase();

        return "음성";
    }
}
