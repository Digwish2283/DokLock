package com.rey.secureApp;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rey.secureApp.dao.DataRepository;
import com.rey.secureApp.dao.UserRepository;
import com.rey.secureApp.encrypt.FilesToSend;
import com.rey.secureApp.entity.Data;
import com.rey.secureApp.entity.User;
//@PreAuthorize("hasRole('stu')")
@CrossOrigin   
@RequestMapping("/student")
@RestController
public class StudentController {

	@Autowired 
	DataRepository dRepo;
	
	@Autowired
	UserRepository uRepo;
	
	@Value("${user.dir:#{systemProperties['user.dir']}}")
    private String projectRootPath;
    
    private String getStoragePath(String username) {
        try {
            String staticPath = projectRootPath + "/uploads/" + username;
            Path path = Paths.get(staticPath);
            if (!path.toFile().exists()) {
                path.toFile().mkdirs();
            }
            return staticPath;
        } catch (Exception e) {
            e.printStackTrace();
            return projectRootPath + "/uploads/" + username;
        }
    }
	
	@RequestMapping("/greet")
	public String hello()
	{
		return "Hello student";
	}
	
	
	@PostMapping( value = "/byImageFile")//, consumes = { "multipart/form-data" })  
	public boolean postMap( @RequestPart("imageFile") MultipartFile imageFile)//)//,   
		//	@RequestPart ( "fieldsToExtract") RequestDto requestDto )
	{
		String fileName=imageFile.getOriginalFilename();
		String username = fileName.substring(0, fileName.indexOf('\\'));
        String filename = fileName.substring(fileName.indexOf('\\')+1, fileName.indexOf('.'));
        String storagePath = getStoragePath(username);
        
        // Create the full path for storing the file
        File directory = new File(storagePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Create the file
        File f = new File(storagePath + "/" + filename + fileName.substring(fileName.indexOf('.')));
		
		try {
			f.createNewFile();
			imageFile.transferTo(f);
			
			String link="http://localhost:4200/shareFile/"+username+"/"+filename;
			
			// Get user ID from username
			User user = uRepo.findByUsername(username);
			Long userid = null;
			if (user != null) {
				userid = user.getId();
			}
			
			// Create Data object with userid
			Data d = new Data(filename, username, link, userid);
			Data d1=dRepo.findByLink(link);
			if(d1==null)
				dRepo.save(d);
		}
		catch (IllegalStateException | IOException e) {
			e.printStackTrace();
		}
		return true;
	}
	
	@PostMapping(value="/files/{username}/{filename}")//,produces = MediaType.I)
	public FilesToSend getFile(@PathVariable String username,@PathVariable String filename) {
		String fileType="image/jpg";
		String storagePath = getStoragePath(username);
	    File file = new File(storagePath + "/" + filename + ".jpg");
	    
	    if(!file.exists()) {
	        file = new File(storagePath + "/" + filename + ".png");
	        fileType="image/png";
	    }
	    
	    if(!file.exists()) {
	        file = new File(storagePath + "/" + filename + ".jpeg");
	        fileType="image/jpeg";  
	    }
	    
	    System.out.println("Looking for file at: " + file.getAbsolutePath());
        System.out.println("File exists: " + file.exists());
	    
	    FilesToSend files=null;
	    String encodeImage="";
	    try {
	        encodeImage = Base64.getEncoder().withoutPadding().encodeToString(Files.readAllBytes(file.toPath()));
	        files=new FilesToSend(fileType,encodeImage);
	    } catch (IOException e) {
	        e.printStackTrace();
	    } 
	    return files; 
	}
	
	@PostMapping("getFiles/{userName}")
	public List<Data> getFiles(@PathVariable String userName)
	{
		System.out.println(userName+2);
		List<Data> data=dRepo.findByUsername(userName);
		System.out.println(data +"aaa");
		return data;
	}
	
	// Rest of the comments removed for brevity
}
