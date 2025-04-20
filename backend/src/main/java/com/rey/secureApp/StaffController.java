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
import org.springframework.web.bind.annotation.RestController;

import com.rey.secureApp.dao.DataRepository;
import com.rey.secureApp.dao.UserRepository;
import com.rey.secureApp.encrypt.FilesToSend;
import com.rey.secureApp.entity.Data;
import com.rey.secureApp.entity.User;

@CrossOrigin
@RestController
@RequestMapping("/staff")
public class StaffController {
	
	@Autowired DataRepository datarepo;
	
	@Autowired
	UserRepository userRepo;
	
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
		return "Hello staff";
	}
	
	@RequestMapping("/getAll")
	public List<Data> getAll()
	{
		return datarepo.findAll();
	}
	
	@RequestMapping("/getVerified")
	public List<Data> getVerified()
	{
		return datarepo.findByStatus(true);
	}
	
	@RequestMapping("/getNonVerified")
	public List<Data> getNonVerified()
	{
		return datarepo.findByStatus(false);
	}
	
	@RequestMapping("/getByUsername/{username}")
	public List<Data> getByUsername(@PathVariable String username)
	{
		List<Data> data=datarepo.findByUsername(username);
		return data;
	}
	
	@RequestMapping("/changeStatus/{username}/{filename}/{status}")
	public void changeStatus( @PathVariable String filename, @PathVariable String username, @PathVariable boolean status)
	{
		Data data =datarepo.findByLink("http://localhost:4200/shareFile/"+username+"/"+filename);
		data.setStatus(status);
		datarepo.save(data);
	}
	
	@PostMapping(value="/files/{username}/{filename}")
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
}
