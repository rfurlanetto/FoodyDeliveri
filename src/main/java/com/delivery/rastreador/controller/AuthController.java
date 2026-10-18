package com.delivery.rastreador.controller;

import com.delivery.rastreador.dto.AuthLoginDTO;
import com.delivery.rastreador.dto.AuthRegisterDTO;
import com.delivery.rastreador.dto.AuthResponseDTO;
import com.delivery.rastreador.model.User;
import com.delivery.rastreador.repository.UserRepository;
import com.delivery.rastreador.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder;
    
    public AuthController(AuthenticationManager authenticationManager, 
                         UserRepository userRepository,
                         TokenService tokenService,
                         PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordEncoder = passwordEncoder;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            return ResponseEntity.badRequest().body("Email já cadastrado");
        }
        
        String encryptedPassword = passwordEncoder.encode(dto.password());
        User user = new User(dto.name(), dto.email(), encryptedPassword);
        userRepository.save(user);
        
        return ResponseEntity.ok("Usuário cadastrado com sucesso");
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthLoginDTO dto) {
        UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(dto.email(), dto.password());
        
        Authentication auth = authenticationManager.authenticate(authToken);
        User user = (User) auth.getPrincipal();
        String token = tokenService.generateToken(user.getEmail());
        
        return ResponseEntity.ok(new AuthResponseDTO(token, user.getId(), user.getName(), user.getEmail()));
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(java.util.Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail()
        ));
    }
}
